import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-recarga',
  templateUrl: './recarga.component.html',
  styleUrls: ['./recarga.component.scss'],
  standalone: false
})
export class RecargaComponent {

  private digitos: string = '0';
  tecladoAberto: boolean = false;

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  get valorFormatado(): string {
    const num = parseInt(this.digitos, 10);
    const reais = Math.floor(num / 100);
    const centavos = num % 100;
    return `R$${reais.toLocaleString('pt-BR')},${centavos.toString().padStart(2, '0')}`;
  }

  get valorNumerico(): number {
    return parseInt(this.digitos, 10) / 100;
  }

  /* Abre o teclado ao clicar no campo de valor */
  abrirTeclado(event: Event) {
    event.stopPropagation();
    this.tecladoAberto = true;
  }

  /* Fecha o teclado ao clicar fora */
  fecharTeclado(event: Event) {
    this.tecladoAberto = false;
  }

  /* Digitar número pelo teclado customizado */
  digitarNumero(num: string) {
    if (this.digitos === '0') {
      this.digitos = num;
    } else {
      if (this.digitos.length >= 9) return;
      this.digitos += num;
    }
  }

  /* Apagar último dígito */
  apagar() {
    if (this.digitos.length <= 1) {
      this.digitos = '0';
    } else {
      this.digitos = this.digitos.slice(0, -1);
    }
  }

  /* Botões +1, +10, +100 — somam diretamente sem abrir teclado */
  adicionar(quantia: number, event: Event) {
    event.stopPropagation();
    const atual = parseInt(this.digitos, 10);
    const novoValor = atual + quantia * 100;
    if (novoValor.toString().length > 9) return;
    this.digitos = novoValor.toString();
  }

  async continuar() {
    if (this.valorNumerico < 1) {
      const toast = await this.toastCtrl.create({
        message: 'Valor mínimo para recarga é R$1,00.',
        duration: 2500,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Conectando ao Mercado Pago...',
      spinner: 'crescent'
    });
    await loading.present();

    this.paymentService.criarPreferencia(this.valorNumerico).subscribe({
      next: async (response) => {
        await loading.dismiss();
        const url = response.checkoutUrlSandbox || response.checkoutUrl;
        window.open(url, '_blank');
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Erro ao criar preferência:', err);
        const toast = await this.toastCtrl.create({
          message: err?.error?.erro || 'Erro ao conectar com o Mercado Pago. Tente novamente.',
          duration: 3000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      }
    });
  }
}