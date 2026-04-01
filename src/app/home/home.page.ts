import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  userName = '';
  balance = 'R$ 0,00';
  usuario: any = null;
  private saldoSub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.carregarDadosUsuario();
    this.carregarSaldo();

    // Inscreve-se para atualizações reativas de saldo
    this.saldoSub = this.paymentService.saldo$.subscribe((s) => {
      if (s != null) {
        this.balance = `R$ ${s.toFixed(2).replace('.', ',')}`;
      }
    });
  }

  ngOnDestroy() {
    if (this.saldoSub) this.saldoSub.unsubscribe();
  }

  carregarDadosUsuario() {
    const usuarioLocal = this.authService.getUsuarioLocal();
    if (usuarioLocal) {
      this.userName = usuarioLocal.nome;
      this.usuario = usuarioLocal;
    }

    this.authService.obterUsuario().subscribe({
      next: (response) => {
        this.usuario = response.usuario;
        this.userName = response.usuario.nome;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do usuário:', err);
        if (err.status === 401) {
          this.authService.logout();
        }
      }
    });
  }

  carregarSaldo() {
    this.paymentService.getSaldo().subscribe({
      next: (response) => {
        this.balance = `R$ ${response.saldo.toFixed(2).replace('.', ',')}`;
      },
      error: (err) => {
        console.error('Erro ao carregar saldo:', err);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
  gosuporte() {
    this.router.navigate(['/suporte']);
  }
  gorecarga() {
    this.router.navigate(['/recarga']);
  }
  gohistorico() {
    this.router.navigate(['/historico']);
  }
  gotickets() {
    this.router.navigate(['/tickets']);
  }
  gohorarios() {
    this.router.navigate(['/horarios']);
  }
}