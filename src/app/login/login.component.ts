import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  cpf: string = '';
  senha: string = '';
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  private apiUrl = (environment as any).backendUrl || 'http://localhost:4000';

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

    this.authService.login(cpfLimpo, this.senha).subscribe({
      next: async (response) => {
        await loader.dismiss();
        this.loading = false;
        await this.showToast(response.mensagem || 'Login realizado com sucesso!', 'success');
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

  async esqueceuSenha() {
    // Passo 1: pedir email
    const alertEmail = await this.alertController.create({
      header: 'Recuperar senha',
      message: 'Digite seu email cadastrado:',
      inputs: [{ name: 'email', type: 'email', placeholder: 'seu@email.com' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar código',
          handler: async (data) => {
            if (!data.email) {
              this.showToast('Digite um email válido.', 'warning');
              return false;
            }
            await this.enviarCodigo(data.email);
            return true;
          }
        }
      ]
    });
    await alertEmail.present();
  }

  private async enviarCodigo(email: string) {
    const loader = await this.loadingCtrl.create({ message: 'Enviando email...' });
    await loader.present();

    this.http.post<any>(`${this.apiUrl}/recuperar-senha`, { email }).subscribe({
      next: async () => {
        await loader.dismiss();
        await this.pedirToken(email);
      },
      error: async (err) => {
        await loader.dismiss();
        this.showToast(err?.error?.erro || 'Erro ao enviar email.', 'danger');
      }
    });
  }

  // Passo 2: usuário abre o email, copia o token e cola aqui
  private async pedirToken(email: string) {
    const alertToken = await this.alertController.create({
      header: 'Verifique seu email',
      message: 'Cole o token recebido no seu email:',
      inputs: [
        {
          name: 'token',
          type: 'text',
          placeholder: 'Cole o token aqui'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async (data) => {
            const token = (data.token || '').trim();
            if (!token) {
              this.showToast('Cole o token recebido por email.', 'warning');
              return false;
            }
            await this.pedirNovaSenha(token);
            return true;
          }
        }
      ]
    });
    await alertToken.present();
  }

  // Passo 3: definir nova senha
  private async pedirNovaSenha(token: string) {
    const alertSenha = await this.alertController.create({
      header: 'Nova senha',
      message: 'Digite sua nova senha:',
      inputs: [
        { name: 'senha', type: 'password', placeholder: 'Nova senha (mín. 6 caracteres)' },
        { name: 'confirmar', type: 'password', placeholder: 'Confirme a senha' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (!data.senha || data.senha.length < 6) {
              this.showToast('Senha deve ter pelo menos 6 caracteres.', 'warning');
              return false;
            }
            if (data.senha !== data.confirmar) {
              this.showToast('As senhas não coincidem.', 'warning');
              return false;
            }
            await this.redefinirSenha(token, data.senha);
            return true;
          }
        }
      ]
    });
    await alertSenha.present();
  }

  private async redefinirSenha(token: string, novaSenha: string) {
    const loader = await this.loadingCtrl.create({ message: 'Salvando senha...' });
    await loader.present();

    this.http.post<any>(`${this.apiUrl}/redefinir-senha`, { token, novaSenha }).subscribe({
      next: async () => {
        await loader.dismiss();
        this.showToast('Senha redefinida com sucesso!', 'success');
      },
      error: async (err) => {
        await loader.dismiss();
        this.showToast(err?.error?.erro || 'Token inválido ou expirado.', 'danger');
      }
    });
  }

  gocadastro() {
    this.router.navigate(['/cadastro']);
  }
}