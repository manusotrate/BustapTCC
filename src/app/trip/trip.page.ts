import {
  Component, OnInit, OnDestroy, AfterViewInit, NgZone
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

declare const L: any; // Leaflet via CDN

@Component({
  selector: 'app-trip',
  templateUrl: './trip.page.html',
  styleUrls: ['./trip.page.scss'],
  standalone: false
})
export class TripPage implements OnInit, OnDestroy, AfterViewInit {

  // ─── Dados do ticket ───
  kmTicket: number = 0;
  kmPercorrido: number = 0;
  kmRestante: number = 0;
  viagemAtiva: boolean = false;

  // ─── Mapa ───
  private map: any = null;
  private marcadorUsuario: any = null;
  private rotaPolyline: any = null;
  private watchId: number | null = null;

  // ─── Posição ───
  private posicaoAnterior: GeolocationCoordinates | null = null;
  posicaoAtual: { lat: number; lng: number } | null = null;

  // ─── UI ───
  erroGps: string = '';
  carregandoGps: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    const km = this.route.snapshot.queryParamMap.get('km');
    if (km) {
      const parsed = parseInt(km, 10);
      if (!isNaN(parsed) && parsed > 0) {
        this.kmTicket = parsed;
        this.kmRestante = parsed;
      }
    }
  }

  ngAfterViewInit() {
    this.carregarLeaflet()
      .then(() => {
        this.inicializarMapa();
        this.iniciarGps();
      })
      .catch(() => {
        this.erroGps = 'Erro ao carregar mapa.';
        this.carregandoGps = false;
      });
  }

  ngOnDestroy() {
    this.pararGps();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // ✅ CORRIGIDO
  private carregarLeaflet(): Promise<void> {
    return new Promise((resolve, reject) => {

      if ((window as any).L) {
        resolve();
        return;
      }

      // evita duplicar CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // se script já existe, só espera carregar
      if (document.querySelector('script[src*="leaflet.js"]')) {
        const check = setInterval(() => {
          if ((window as any).L) {
            clearInterval(check);
            resolve();
          }
        }, 50);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

      script.onload = () => resolve();
      script.onerror = () => reject();

      document.body.appendChild(script);
    });
  }

  private inicializarMapa() {
    this.map = L.map('trip-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([-22.2159, -49.9496], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    const iconeUsuario = L.divIcon({
      className: '',
      html: `<div class="marker-usuario"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    this.marcadorUsuario = L.marker([0, 0], { icon: iconeUsuario });
  }

  // ✅ CORRIGIDO
  private iniciarGps() {
    if (!navigator.geolocation) {
      this.ngZone.run(() => {
        this.erroGps = 'GPS não disponível neste dispositivo.';
        this.carregandoGps = false;
      });
      return;
    }

    // evita múltiplos watchers
    if (this.watchId !== null) return;

    this.carregandoGps = true;

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.ngZone.run(() => this.onPosicaoAtualizada(pos));
      },
      (err) => {
        this.ngZone.run(() => {
          this.onErroPosicao(err);

          // tenta recuperar se timeout
          if (err.code === 3) {
            this.pararGps();
            setTimeout(() => this.iniciarGps(), 2000);
          }
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 30000
      }
    );
  }

  private pararGps() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private onPosicaoAtualizada(pos: GeolocationPosition) {
    this.carregandoGps = false;
    this.erroGps = '';

    const { latitude: lat, longitude: lng } = pos.coords;
    this.posicaoAtual = { lat, lng };

    this.marcadorUsuario.setLatLng([lat, lng]);

    if (!this.map.hasLayer(this.marcadorUsuario)) {
      this.marcadorUsuario.addTo(this.map);
    }

    this.map.setView([lat, lng], 15);

    if (this.viagemAtiva && this.posicaoAnterior) {
      const distancia = this.calcularDistanciaM(
        this.posicaoAnterior.latitude,
        this.posicaoAnterior.longitude,
        lat,
        lng
      );

      const distanciaKm = distancia / 1000;

      if (distanciaKm > 0.005) {
        this.kmPercorrido += distanciaKm;
        this.kmRestante = Math.max(0, this.kmTicket - this.kmPercorrido);

        if (this.rotaPolyline) {
          const coords = this.rotaPolyline.getLatLngs();
          coords.push([lat, lng]);
          this.rotaPolyline.setLatLngs(coords);
        }

        if (this.kmRestante <= 0) {
          this.ticketEsgotado();
        }
      }
    }

    this.posicaoAnterior = pos.coords;
  }

  private onErroPosicao(err: GeolocationPositionError) {
    this.carregandoGps = false;

    switch (err.code) {
      case 1:
        this.erroGps = 'Permissão de GPS negada.';
        break;
      case 2:
        this.erroGps = 'Posição indisponível.';
        break;
      case 3:
        this.erroGps = 'Tempo de GPS esgotado.';
        break;
    }
  }

  private calcularDistanciaM(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const R = 6371000;

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  iniciarViagem() {
    if (!this.posicaoAtual) return;

    this.viagemAtiva = true;
    this.kmPercorrido = 0;
    this.kmRestante = this.kmTicket;

    this.rotaPolyline = L.polyline(
      [[this.posicaoAtual.lat, this.posicaoAtual.lng]],
      { color: '#1a1a1a', weight: 5, opacity: 0.8 }
    ).addTo(this.map);
  }

  async encerrarViagem() {
    const alert = await this.alertCtrl.create({
      header: 'Encerrar viagem?',
      message: `Você percorreu ${this.kmPercorridoFormatado}. Os km restantes serão perdidos.`,
      buttons: [
        { text: 'Continuar', role: 'cancel' },
        {
          text: 'Encerrar',
          handler: () => {
            this.viagemAtiva = false;
            this.pararGps();
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  private async ticketEsgotado() {
    this.viagemAtiva = false;
    this.pararGps();

    const alert = await this.alertCtrl.create({
      header: 'Ticket esgotado!',
      message: `Você utilizou ${this.kmTicket} km.`,
      buttons: [{
        text: 'OK',
        handler: () => this.router.navigate(['/home'])
      }]
    });

    await alert.present();
  }

  get kmPercorridoFormatado(): string {
    return `${this.kmPercorrido.toFixed(2)} km`;
  }

  get kmRestanteFormatado(): string {
    return `${this.kmRestante.toFixed(2)} km`;
  }

  get percentualUsado(): number {
    if (this.kmTicket === 0) return 0;
    return Math.min(100, (this.kmPercorrido / this.kmTicket) * 100);
  }

  goBack() {
    this.navCtrl.back();
  }
}