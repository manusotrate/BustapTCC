import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  cpf: string = '';
  senha: string = '';
  loading: boolean = false;
  apiUrl: string = 'http://localhost:4000/login';

  constructor(
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  private validarCPF(cpf: string): boolean {
    const num = (cpf || '').replace(/\D/g, '');
    if (num.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(num)) return false;

    const calcDV = (base: string, pesoInicial: number) => {
      let soma = 0;
      for (let i = 0; i < base.length; i++) {
        soma += parseInt(base[i], 10) * (pesoInicial - i);
      }
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };
    
    const dv1 = calcDV(num.substring(0, 9), 10);
    const dv2 = calcDV(num.substring(0, 10), 11);
    return dv1 === parseInt(num[9], 10) && dv2 === parseInt(num[10], 10);
  }

  async irParaHome() {
    const cpfLimpo = this.cpf.replace(/\D/g, '');

    if (!this.cpf || !this.senha) {
      this.showToast('Preencha CPF e Senha!', 'warning');
      return;
    }
    if (!this.validarCPF(this.cpf)) {
      this.showToast('CPF inválido.', 'danger');
      return;
    }

    this.loading = true;
    const loader = await this.loadingCtrl.create({ message: 'Entrando...' });
    await loader.present();

    this.http.post<{ mensagem?: string, usuario?: any }>(this.apiUrl, { cpf: cpfLimpo, senha: this.senha })
      .subscribe({
        next: async (res) => {
          await loader.dismiss();
          this.loading = false;
          
          console.log('Resposta do backend:', res); // DEBUG
          
          // Salvar dados do usuário no localStorage
          if (res.usuario) {
            console.log('Salvando usuário:', res.usuario); // DEBUG
            localStorage.setItem('usuario', JSON.stringify(res.usuario));
            console.log('Usuario salvo no localStorage!'); // DEBUG
          } else {
            console.log('Nenhum dado de usuário recebido do backend!'); // DEBUG
          }
          
          await this.showToast(res.mensagem || 'Login realizado com sucesso!', 'success');
          this.router.navigate(['/home']);
        },
        error: async (err) => {
          await loader.dismiss();
          this.loading = false;
          const msg = err?.error?.erro || err?.error?.message || 'Erro ao efetuar login.';
          this.showToast(msg, 'danger');
          console.error('Erro de login:', err);
        }
      });
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'medium' = 'medium') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });
    await toast.present();
  }
}