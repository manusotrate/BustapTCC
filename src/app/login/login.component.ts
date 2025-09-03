import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonInput } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @ViewChild('cpfInput', { static: true }) cpfInput!: IonInput;
  @ViewChild('senhaInput', { static: true }) senhaInput!: IonInput;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {}

  irParaHome() {
    const cpf = this.cpfInput.value as string;
    const senha = this.senhaInput.value as string;

    if (!cpf || !senha) {
      alert('Preencha CPF e Senha!');
      return;
    }

    this.http.post<any>('http://localhost:4000/login', { cpf, senha })
      .subscribe({
        next: (res) => {
          alert(res.mensagem);
          this.router.navigate(['/home']); // ✅ redireciona se login for válido
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.erro || 'Erro no login');
        }
      });
  }
}
