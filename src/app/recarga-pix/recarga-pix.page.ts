import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-recarga-pix',
  templateUrl: './recarga-pix.page.html',
  styleUrls: ['./recarga-pix.page.scss'],
  standalone: false
})
export class RecargaPixPage implements OnInit, OnDestroy {
  valor: number = 0;
  paymentId: number | null = null;
  qrCode: string = '';
  qrCodeBase64: string = '';
  status: string = 'pending';
  carregando: boolean = true;
  copiado: boolean = false;

  private pollingInterval: any = null;

  get valorFormatado(): string {
    return `R$${this.valor.toFixed(2).replace('.', ',')}`;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    const v = this.route.snapshot.queryParamMap.get('valor');
    if (v) this.valor = parseFloat(v);
    this.gerarPix();
  }

  ngOnDestroy() {
    this.pararPolling();
  }

  gerarPix() {
    this.carregando = true;
    this.paymentService.criarPagamentoPix(this.valor).subscribe({
      next: (response) => {
        this.paymentId = response.paymentId;
        this.qrCode = response.qrCode;
        this.qrCodeBase64 = response.qrCodeBase64;
        this.status = response.status;
        this.carregando = false;
        this.iniciarPolling();
      },
      error: async (err) => {
        this.carregando = false;
        const toast = await this.toastCtrl.create({
          message: err?.error?.erro || 'Erro ao gerar Pix. Tente novamente.',
          duration: 3000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
        this.router.navigate(['/recarga']);
      }
    });
  }

  // Verifica a cada 5 segundos se o Pix foi pago
  iniciarPolling() {
    this.pollingInterval = setInterval(() => {
      if (!this.paymentId) return;

      this.paymentService.consultarStatus(this.paymentId).subscribe({
        next: async (response) => {
          this.status = response.status;

          if (response.status === 'approved') {
            this.pararPolling();
            const toast = await this.toastCtrl.create({
              message: `✅ Pix confirmado! R$${this.valor.toFixed(2).replace('.', ',')} adicionado ao seu saldo.`,
              duration: 4000,
              color: 'success',
              position: 'top'
            });
            await toast.present();
            this.router.navigate(['/home']);
          }

          if (response.status === 'cancelled' || response.status === 'rejected') {
            this.pararPolling();
          }
        },
        error: () => {} // silencia erros de polling
      });
    }, 5000);
  }

  pararPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  async copiarCodigo() {
    if (!this.qrCode) return;
    await navigator.clipboard.writeText(this.qrCode);
    this.copiado = true;
    setTimeout(() => this.copiado = false, 2500);

    const toast = await this.toastCtrl.create({
      message: 'Código Pix copiado!',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  goBack() {
    this.pararPolling();
    this.router.navigate(['/recarga/metodo'], { queryParams: { valor: this.valor } });
  }
}