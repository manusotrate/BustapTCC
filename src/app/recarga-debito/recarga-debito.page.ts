import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';

declare const MercadoPago: any;

@Component({
  selector: 'app-recarga-debito',
  templateUrl: './recarga-debito.page.html',
  styleUrls: ['./recarga-debito.page.scss'],
  standalone: false
})
export class RecargaDebitoPage implements OnInit, AfterViewInit {
  valor: number = 0;
  carregando: boolean = false;

  // Dados do formulário
  numeroCartao: string = '';
  nomeCartao: string = '';
  validade: string = '';
  cvv: string = '';
  cpfCartao: string = '';

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
  }

  ngAfterViewInit() {
    this.carregarSDKMercadoPago();
  }

  // Carrega o SDK do MP para tokenizar o cartão
  private carregarSDKMercadoPago(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).MercadoPago) { resolve(); return; }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  formatarNumero(event: any) {
    let value = event.target.value.replace(/\D/g, '').slice(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    this.numeroCartao = value;
    event.target.value = value;
  }

  formatarValidade(event: any) {
    let value = event.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    this.validade = value;
    event.target.value = value;
  }

  async pagar() {
    if (!this.numeroCartao || !this.nomeCartao || !this.validade || !this.cvv || !this.cpfCartao) {
      const toast = await this.toastCtrl.create({
        message: 'Preencha todos os campos do cartão.',
        duration: 2500,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Processando pagamento...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const mp = new MercadoPago(this.getPublicKey(), { locale: 'pt-BR' });

      const [mesStr, anoStr] = this.validade.split('/');
      const numeroLimpo = this.numeroCartao.replace(/\s/g, '');

      // Tokeniza o cartão no lado do cliente (nunca envia dados brutos ao backend)
      const tokenResult = await mp.createCardToken({
        cardNumber: numeroLimpo,
        cardholderName: this.nomeCartao,
        cardExpirationMonth: mesStr,
        cardExpirationYear: `20${anoStr}`,
        securityCode: this.cvv,
        identificationType: 'CPF',
        identificationNumber: this.cpfCartao.replace(/\D/g, ''),
      });

      // Detecta bandeira pelo número
      const paymentMethodId = this.detectarBandeira(numeroLimpo);

      this.paymentService.criarPagamentoDebito({
        valor: this.valor,
        token: tokenResult.id,
        issuerId: tokenResult.issuer_id || '',
        installments: 1,
        paymentMethodId,
      }).subscribe({
        next: async (response) => {
          await loading.dismiss();

          if (response.status === 'approved') {
            const toast = await this.toastCtrl.create({
              message: `✅ Pagamento aprovado! ${this.valorFormatado} adicionado ao saldo.`,
              duration: 4000,
              color: 'success',
              position: 'top'
            });
            await toast.present();
            this.router.navigate(['/home']);
          } else {
            const toast = await this.toastCtrl.create({
              message: `Pagamento ${response.status}. Tente outro cartão.`,
              duration: 3000,
              color: 'warning',
              position: 'top'
            });
            await toast.present();
          }
        },
        error: async (err) => {
          await loading.dismiss();
          const toast = await this.toastCtrl.create({
            message: err?.error?.erro || 'Erro ao processar pagamento.',
            duration: 3000,
            color: 'danger',
            position: 'top'
          });
          await toast.present();
        }
      });

    } catch (err: any) {
      await loading.dismiss();
      console.error('Erro ao tokenizar cartão:', err);
      const toast = await this.toastCtrl.create({
        message: 'Dados do cartão inválidos. Verifique e tente novamente.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }

  private getPublicKey(): string {
    // Coloque sua Public Key do MP aqui (começa com APP_USR- também, mas é a PUBLIC KEY)
    return 'APP_USR-9d34a699-0048-40be-a3f0-4e7c97dfd0eb';
  }

  private detectarBandeira(numero: string): string {
    if (/^4/.test(numero)) return 'visa';
    if (/^5[1-5]/.test(numero)) return 'master';
    if (/^6(?:011|5)/.test(numero)) return 'elo';
    return 'visa';
  }

  goBack() {
    this.router.navigate(['/recarga/metodo'], { queryParams: { valor: this.valor } });
  }
}