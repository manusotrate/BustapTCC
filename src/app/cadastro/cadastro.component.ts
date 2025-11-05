import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {
  registrationForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private http: HttpClient
  ) {
    this.registrationForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      sobrenome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, this.validateCPF.bind(this)]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  onInput(event: any): void {
    const inputElement = event.target;
    inputElement.classList.add('typing');

    // Remove a classe após 500ms para reiniciar a animação
    setTimeout(() => {
      inputElement.classList.remove('typing');
    }, 500);
  }

  validateCPF(control: AbstractControl) {
    const cpf = control.value ? String(control.value).replace(/\D/g, '') : '';
    
    if (!cpf || cpf.length !== 11) {
      return { invalidCPF: true };
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { invalidCPF: true };
    }

    // Valida primeiro dígito verificador
    let sum = 0;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10), 10)) {
      return { invalidCPF: true };
    }

    // Valida segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11), 10)) {
      return { invalidCPF: true };
    }

    return null;
  }

  // Formatação automática do CPF
  formatCPF(event: any) {
    let value: string = (event?.detail?.value ?? event?.target?.value ?? '').replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    }
    
    this.registrationForm.get('cpf')?.setValue(value, { emitEvent: false });
  }

  // Função para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Função de envio para o backend
  async onSubmit() {
    if (this.registrationForm.invalid) {
      await this.showAlert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Realizando cadastro...',
      spinner: 'crescent'
    });
    await loading.present();

    const formData = this.registrationForm.value;
    
    // Remove formatação do CPF para enviar apenas números
    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    
    const dadosEnvio = {
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      email: formData.email,
      cpf: cpfLimpo,
      senha: formData.senha
    };

    try {
      const response = await this.http.post<any>('http://localhost:4000/cadastro', dadosEnvio).toPromise();
      
      await loading.dismiss();
      this.isLoading = false;

      const alert = await this.alertController.create({
        header: 'Sucesso!',
        message: response?.mensagem || 'Cadastro realizado com sucesso!',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }]
      });
      await alert.present();

    } catch (error: any) {
      await loading.dismiss();
      this.isLoading = false;

      console.error('Erro no cadastro:', error);
      
      const errorMessage = error?.error?.erro || 
                          error?.error?.message || 
                          error?.message || 
                          'Erro no cadastro. Tente novamente.';

      await this.showAlert('Erro', errorMessage);
    }
  }

  // Navegar para login
  gologin() {
    this.router.navigate(['/login']);
  }

  // Método para verificar se um campo específico é inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Método para obter mensagem de erro de um campo
  getErrorMessage(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} é obrigatório`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['invalidCPF']) {
        return 'CPF inválido';
      }
    }
    return '';
  }
}