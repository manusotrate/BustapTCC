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
    return `R$\u00a0${reais.toLocaleString('pt-BR')},${centavos.toString().padStart(2, '0')}`;
  }

  get valorNumerico(): number {
    return parseInt(this.digitos, 10) / 100;
  }

  digitarNumero(num: string) {
    if (this.digitos === '0') {
      this.digitos = num;
    } else {
      if (this.digitos.length >= 9) return;
      this.digitos += num;
    }
  }

  apagar() {
    if (this.digitos.length <= 1) {
      this.digitos = '0';
    } else {
      this.digitos = this.digitos.slice(0, -1);
    }
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

        // Em ambiente de desenvolvimento usa sandbox, em produção usa checkoutUrl
        const url = response.checkoutUrlSandbox || response.checkoutUrl;

        // Abre o checkout do Mercado Pago no navegador
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