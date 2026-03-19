import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HistoricoItem {
  rota: string;
  ticket: string;
  dia: string;
  mes: string;
}

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
})
export class HistoricoComponent implements OnInit {

  termoBusca: string = '';

  // Dados de exemplo — futuramente substituir por chamada ao backend
  historico: HistoricoItem[] = [
    { rota: 'Marília → Quintana',      ticket: '30 Min', dia: '07', mes: 'JUN' },
    { rota: 'Marília → Garça',         ticket: '45 Min', dia: '12', mes: 'JUN' },
    { rota: 'Garça → Marília',         ticket: '45 Min', dia: '14', mes: 'JUN' },
    { rota: 'Marília → Vera Cruz',     ticket: '15 Min', dia: '20', mes: 'JUN' },
    { rota: 'Marília → Tupã',          ticket: '60 Min', dia: '03', mes: 'JUL' },
    { rota: 'Tupã → Marília',          ticket: '60 Min', dia: '05', mes: 'JUL' },
    { rota: 'Marília → Pompéia',       ticket: '30 Min', dia: '18', mes: 'JUL' },
    { rota: 'Marília → Oriente',       ticket: '15 Min', dia: '22', mes: 'JUL' },
  ];

  historicoFiltrado: HistoricoItem[] = [];

  ngOnInit() {
    this.historicoFiltrado = [...this.historico];
  }

  filtrar() {
    const termo = this.termoBusca.toLowerCase().trim();

    if (!termo) {
      this.historicoFiltrado = [...this.historico];
      return;
    }

    this.historicoFiltrado = this.historico.filter(item =>
      item.rota.toLowerCase().includes(termo)   ||
      item.ticket.toLowerCase().includes(termo) ||
      item.mes.toLowerCase().includes(termo)
    );
  }
}