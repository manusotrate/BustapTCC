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
      const anoCompleto = '20' + anoStr; // Converter para 4 dígitos

      console.log('🔐 Iniciando tokenização...', {
        cardNumber: numeroLimpo.substring(0, 4) + '****' + numeroLimpo.substring(12),
        cardholderName: this.nomeCartao,
        expiry: `${mesStr}/${anoCompleto}`
      });

      // Tokeniza o cartão no lado do cliente (nunca envia dados brutos ao backend)
      const tokenResult = await mp.createCardToken({
        cardNumber: numeroLimpo,
        cardholderName: this.nomeCartao,
        cardExpirationMonth: mesStr,
        cardExpirationYear: anoCompleto, // 4 dígitos (YYYY)
        securityCode: this.cvv,
        identificationType: 'CPF',
        identificationNumber: this.cpfCartao.replace(/\D/g, ''),
      });

      console.log('✅ Token criado:', {
        id: tokenResult.id ? `${tokenResult.id.substring(0, 20)}...` : 'nulo',
        issuer_id: tokenResult.issuer_id,
        payment_type_id: tokenResult.payment_type_id,
        hasError: !!tokenResult.error
      });

      if (tokenResult.error) {
        throw new Error(tokenResult.error);
      }

      // Detecta bandeira pelo número (visa, master, elo)
      const paymentMethodId = tokenResult.payment_method_id || this.detectarBandeira(numeroLimpo);

      console.log('📤 Enviando pagamento:', { 
        valor: this.valor, 
        paymentMethodId,
        payment_type_id: tokenResult.payment_type_id,
        installments: 1 
      });

      console.log('🔍 Bandeira detectada pelo MP:', tokenResult.payment_method_id);

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
      console.error('❌ Erro ao tokenizar cartão:', err);
      console.error('Stack:', err.stack);
      
      // Tenta extrair mensagem de erro
      let mensagem = 'Dados do cartão inválidos. Verifique e tente novamente.';
      if (err.message) mensagem = err.message;
      if (err.error?.message) mensagem = err.error.message;
      
      const toast = await this.toastCtrl.create({
        message: mensagem,
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }

  private getPublicKey(): string {
    // Coloque sua Public Key do MP aqui (começa com APP_USR- também, mas é a PUBLIC KEY)
    return 'TEST-3d5c31ff-924d-4da7-b035-0dcdabdb3a0d';
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