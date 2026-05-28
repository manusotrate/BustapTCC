import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

interface Cidade {
  nome: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
  standalone: false
})
export class HorariosPage implements OnInit {

  localPartida: Cidade | null = null;
  localChegada: Cidade | null = null;
  distanciaKm: number = 0;
  carregandoDistancia: boolean = false;

  tempoEstimado: string = '';

  // Chave gratuita do openrouteservice.org
  private ORS_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImQ5M2NkMThhMTEyYzQ0NThiODVlNjU1YmFhYjAxMGFhIiwiaCI6Im11cm11cjY0In0=';

  cidades: Cidade[] = [
    { nome: 'Álvaro de Carvalho',    lat: -22.0840, lng: -49.7192 },
    { nome: 'Alvinlândia',           lat: -22.4435, lng: -49.7628 },
    { nome: 'Borá',                  lat: -22.2697, lng: -50.5409 },
    { nome: 'Cabrália Paulista',     lat: -22.457238, lng: -49.339412 },
    { nome: 'Campos Novos Paulista', lat: -22.601972, lng: -50.016541 },
    { nome: 'Duartina',              lat: -22.4141, lng: -49.4037 },
    { nome: 'Echaporã',              lat: -22.4326, lng: -50.2037 },
    { nome: 'Fernão',                lat: -22.3607, lng: -49.5220 },
    { nome: 'Gália',                 lat: -22.2915, lng: -49.5513 },
    { nome: 'Garça',                 lat: -22.2114, lng: -49.6565 },
    { nome: 'Guaimbê',               lat: -21.9098, lng: -49.8987 },
    { nome: 'Guarantã',              lat: -21.8947, lng: -49.5911 },
    { nome: 'Herculândia',           lat: -22.0039, lng: -50.3907 },
    { nome: 'Iacri',                 lat: -21.8572, lng: -50.6895 },
    { nome: 'Júlio Mesquita',        lat: -22.0049, lng: -49.7878 },
    { nome: 'Lupércio',              lat: -22.4146, lng: -49.8188 },
    { nome: 'Lutécia',               lat: -22.3384, lng: -50.3947 },
    { nome: 'Marília',               lat: -22.2171, lng: -49.9501 },
    { nome: 'Ocauçu',                lat: -22.4385, lng: -49.9227 },
    { nome: 'Oriente',               lat: -22.1458, lng: -50.0918 },
    { nome: 'Oscar Bressane',        lat: -22.3148, lng: -50.2811 },
    { nome: 'Parapuã',               lat: -21.7902, lng: -50.7809 },
    { nome: 'Pompéia',               lat: -22.1084, lng: -50.1717 },
    { nome: 'Queiroz',               lat: -21.7967, lng: -50.2411 },
    { nome: 'Rinópolis',             lat: -21.7284, lng: -50.7243 },
    { nome: 'Tupã',                  lat: -21.9347, lng: -50.5136 },
    { nome: 'Ubirajara',             lat: -22.5267, lng: -49.6617 },
    { nome: 'Vera Cruz',             lat: -22.2183, lng: -49.8208 },
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  async abrirSeletor(tipo: 'partida' | 'chegada') {
    const titulo = tipo === 'partida' ? 'Local de partida' : 'Local de chegada';
    const selecionada = tipo === 'partida' ? this.localPartida : this.localChegada;

    const alert = await this.alertController.create({
      header: titulo,
      inputs: this.cidades.map(cidade => ({
        type: 'radio' as const,
        label: cidade.nome,
        value: cidade,
        checked: selecionada?.nome === cidade.nome,
      })),
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: (cidadeSelecionada: Cidade) => {
            if (!cidadeSelecionada) return;
            if (tipo === 'partida') {
              this.localPartida = cidadeSelecionada;
            } else {
              this.localChegada = cidadeSelecionada;
            }
            this.calcularDistancia();
          },
        },
      ],
    });

    await alert.present();
  }

  calcularDistancia() {
    if (!this.localPartida || !this.localChegada) {
      this.distanciaKm = 0;
      this.tempoEstimado = '';
      return;
    }
    if (this.localPartida.nome === this.localChegada.nome) {
      this.distanciaKm = 0;
      this.tempoEstimado = '0min';
      return;
    }

    this.carregandoDistancia = true;
    this.distanciaKm = 0;
    this.tempoEstimado = '';

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${this.ORS_KEY}&start=${this.localPartida.lng},${this.localPartida.lat}&end=${this.localChegada.lng},${this.localChegada.lat}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        try {
          const segmento = response.features[0].properties.segments[0];
          const metros = segmento.distance;
          const segundos = segmento.duration;
          const km = Math.round(metros / 1000);

          const haversine = this.calcularHaversine(
            this.localPartida!.lat, this.localPartida!.lng,
            this.localChegada!.lat, this.localChegada!.lng
          );

          const fator = km / haversine;

          if (km === 0 || fator < 1 || fator > 2.5) {
            this.distanciaKm = Math.round(haversine * 1.18);
            this.calcularTempoComSegundos((this.distanciaKm / 75) * 3600);
          } else {
            this.distanciaKm = km;
            this.calcularTempoComSegundos(segundos);
            
          }
        } catch {
          this.usarFallbackHaversine();
        }
        this.carregandoDistancia = false;
      },
      error: () => {
        this.usarFallbackHaversine();
        this.carregandoDistancia = false;
      }
    });
  }

  private usarFallbackHaversine() {
    const km = this.calcularHaversine(
      this.localPartida!.lat, this.localPartida!.lng,
      this.localChegada!.lat, this.localChegada!.lng
    );
    this.distanciaKm = Math.round(km * 1.15);
    this.calcularTempoComSegundos((this.distanciaKm / 60) * 3600);
  }

  private calcularHaversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  calcularTempoComSegundos(segundos: number) {
    const minutos = Math.round(segundos / 60);
    if (minutos >= 60) {
      const horas = Math.floor(minutos / 60);
      const min = minutos % 60;
      this.tempoEstimado = min > 0 ? `${horas}h${min}min` : `${horas}h`;
    } else {
      this.tempoEstimado = `${minutos}min`;
    }
  }

  // Mantido para compatibilidade com testes existentes
  calcularTempo() {
    if (!this.localPartida || !this.localChegada) {
      this.tempoEstimado = '';
      return;
    }
    if (this.localPartida.nome === this.localChegada.nome) {
      this.tempoEstimado = '0min';
      return;
    }
    const velocidadeMedia = 60;
    const minutos = Math.round((this.distanciaKm / velocidadeMedia) * 60);
    if (minutos >= 60) {
      const horas = Math.floor(minutos / 60);
      const min = minutos % 60;
      this.tempoEstimado = min > 0 ? `${horas}h${min}min` : `${horas}h`;
    } else {
      this.tempoEstimado = `${minutos}min`;
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  compararCidade(c1: Cidade, c2: Cidade): boolean {
    return c1 && c2 ? c1.nome === c2.nome : c1 === c2;
  }

  get distanciaFormatada(): string {
    if (this.carregandoDistancia) return 'Calculando...';
    if (!this.localPartida || !this.localChegada) return '';
    if (this.distanciaKm === 0) return '0 km';
    return `${this.distanciaKm} km`;
  }

  comecarViagem() {
    if (!this.localPartida || !this.localChegada) return;

    this.router.navigate(['/tickets'], {
      queryParams: {
        partida: this.localPartida.nome,
        chegada: this.localChegada.nome,
        km: this.distanciaKm,
      },
    });
  }
}