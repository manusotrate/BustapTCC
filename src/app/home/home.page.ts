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
export class HomePage implements OnInit, OnDestroy {
  userName = '';
  balance = 'R$ 0,00';
  usuario: any = null;
  private saldoSub: Subscription | null = null;
  private saldoInterval: any = null;

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

    // Polling: atualiza saldo a cada 30 segundos
    this.saldoInterval = setInterval(() => {
      try {
        if (!this.authService.isAuthenticated()) {
          console.log('Polling: usuário não autenticado — pulando chamada de saldo');
          return;
        }
        console.log('Polling: solicitando /usuario/saldo');
        this.paymentService.getSaldo().subscribe({
          next: (resp) => {
            if (resp && typeof resp.saldo === 'number') {
              this.balance = `R$ ${resp.saldo.toFixed(2).replace('.', ',')}`;
            }
          },
          error: (err) => {
            console.error('Erro no polling de saldo:', err);
          }
        });
      } catch (err) {
        console.error('Erro no bloco polling:', err);
      }
    }, 30000);
  }
  ngOnDestroy() {
    if (this.saldoSub) this.saldoSub.unsubscribe();
    if (this.saldoInterval) clearInterval(this.saldoInterval);
  }

  // Pull-to-refresh handler
  doRefresh(event: any) {
    // Recarrega saldo e dados do usuário
    this.paymentService.getSaldo().subscribe({
      next: (resp) => {
        // `getSaldo()` já atualiza o subject, mas atualiza também a UI caso necessário
        this.balance = `R$ ${resp.saldo.toFixed(2).replace('.', ',')}`;
        // Recarrega informações do usuário
        this.carregarDadosUsuario();
        event.target.complete();
      },
      error: (err) => {
        console.error('Erro ao atualizar saldo via pull-to-refresh:', err);
        this.carregarDadosUsuario();
        event.target.complete();
      }
    });
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