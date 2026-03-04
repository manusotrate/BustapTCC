import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

interface Cidade {
  nome: string;
  distanciaDeMarilia: number;
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
  tempoEstimado: string = '';

  cidades: Cidade[] = [
    { nome: 'Marília',               distanciaDeMarilia: 0   },
    { nome: 'Álvaro de Carvalho',    distanciaDeMarilia: 44  },
    { nome: 'Alvinlândia',           distanciaDeMarilia: 45  },
    { nome: 'Borá',                  distanciaDeMarilia: 86  },
    { nome: 'Cabrália Paulista',     distanciaDeMarilia: 87  },
    { nome: 'Campos Novos Paulista', distanciaDeMarilia: 63  },
    { nome: 'Duartina',              distanciaDeMarilia: 79  },
    { nome: 'Echaporã',              distanciaDeMarilia: 40  },
    { nome: 'Fernão',                distanciaDeMarilia: 60  },
    { nome: 'Gália',                 distanciaDeMarilia: 52  },
    { nome: 'Garça',                 distanciaDeMarilia: 34  },
    { nome: 'Guaimbê',               distanciaDeMarilia: 41  },
    { nome: 'Guarantã',              distanciaDeMarilia: 60  },
    { nome: 'Herculândia',           distanciaDeMarilia: 59  },
    { nome: 'Iacri',                 distanciaDeMarilia: 95  },
    { nome: 'Júlio Mesquita',        distanciaDeMarilia: 35  },
    { nome: 'Lupércio',              distanciaDeMarilia: 33  },
    { nome: 'Lutécia',               distanciaDeMarilia: 57  },
    { nome: 'Ocauçu',                distanciaDeMarilia: 37  },
    { nome: 'Oriente',               distanciaDeMarilia: 19  },
    { nome: 'Oscar Bressane',        distanciaDeMarilia: 42  },
    { nome: 'Parapuã',               distanciaDeMarilia: 72  },
    { nome: 'Pompéia',               distanciaDeMarilia: 48  },
    { nome: 'Queiroz',               distanciaDeMarilia: 90  },
    { nome: 'Rinópolis',             distanciaDeMarilia: 100 },
    { nome: 'Tupã',                  distanciaDeMarilia: 68  },
    { nome: 'Ubirajara',             distanciaDeMarilia: 55  },
    { nome: 'Vera Cruz',             distanciaDeMarilia: 30  },
  ];

  constructor(
    private router: Router,
    private alertController: AlertController
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
            this.calcularTempo();
          },
        },
      ],
    });

    await alert.present();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  compararCidade(c1: Cidade, c2: Cidade): boolean {
    return c1 && c2 ? c1.nome === c2.nome : c1 === c2;
  }

  calcularTempo() {
    if (!this.localPartida || !this.localChegada) {
      this.tempoEstimado = '';
      return;
    }

    if (this.localPartida.nome === this.localChegada.nome) {
      this.tempoEstimado = '0min';
      return;
    }

    const distancia = Math.abs(
      this.localPartida.distanciaDeMarilia - this.localChegada.distanciaDeMarilia
    ) + Math.min(
      this.localPartida.distanciaDeMarilia,
      this.localChegada.distanciaDeMarilia
    );

    const minutos = Math.round((distancia / 80) * 60);

    if (minutos < 60) {
      this.tempoEstimado = `${minutos}min`;
    } else {
      const h = Math.floor(minutos / 60);
      const m = minutos % 60;
      this.tempoEstimado = m > 0 ? `${h}h ${m}min` : `${h}h`;
    }
  }

  comecarViagem() {
    if (!this.localPartida || !this.localChegada) return;

    this.router.navigate(['/viagem'], {
      queryParams: {
        partida: this.localPartida.nome,
        chegada: this.localChegada.nome,
        tempo: this.tempoEstimado,
      },
    });
  }
}