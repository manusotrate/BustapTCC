import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, HistoricoItem } from '../services/payment.service';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
})
export class HistoricoComponent implements OnInit {

  termoBusca: string = '';
  carregando: boolean = true;

  historico: HistoricoItem[] = [];
  historicoFiltrado: HistoricoItem[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.carregarHistorico();
  }

  carregarHistorico() {
    this.carregando = true;
    this.paymentService.getHistorico().subscribe({
      next: (response) => {
        this.historico = response.historico;
        this.historicoFiltrado = [...this.historico];
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico:', err);
        this.carregando = false;
      }
    });
  }

  filtrar() {
    const termo = this.termoBusca.toLowerCase().trim();
    if (!termo) {
      this.historicoFiltrado = [...this.historico];
      return;
    }
    this.historicoFiltrado = this.historico.filter(item =>
      item.origem.toLowerCase().includes(termo) ||
      item.destino.toLowerCase().includes(termo)
    );
  }

  // Formata "2025-06-07T..." → dia: "07", mes: "JUN"
  getDia(usado_em: string): string {
    return new Date(usado_em).getDate().toString().padStart(2, '0');
  }

  getMes(usado_em: string): string {
    return new Date(usado_em)
      .toLocaleString('pt-BR', { month: 'short' })
      .toUpperCase()
      .replace('.', '');
  }
}