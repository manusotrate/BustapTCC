import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface PixResponse {
  paymentId: number;
  status: string;
  qrCode: string;
  qrCodeBase64: string;
}

export interface DebitoResponse {
  paymentId: number;
  status: string;
  statusDetail: string;
  novoSaldo?: number;
}

export interface StatusResponse {
  status: string;
  statusDetail: string;
}

export interface SaldoResponse {
  saldo: number;
}

export interface TicketsResponse {
  tickets: any[];
}

export interface ComprarTicketResponse {
  mensagem: string;
  saldo: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:4000';
  private saldoSubject = new BehaviorSubject<number | null>(null);
  public saldo$ = this.saldoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── Pix ──
  criarPagamentoPix(valor: number): Observable<PixResponse> {
    return this.http.post<PixResponse>(
      `${this.apiUrl}/pagamentos/pix`,
      { valor },
      { headers: this.getHeaders() }
    );
  }

  // ── Débito ──
  criarPagamentoDebito(dados: {
    valor: number;
    token: string;
    issuerId: string;
    installments: number;
    paymentMethodId: string;
  }): Observable<DebitoResponse> {
    return this.http.post<DebitoResponse>(
      `${this.apiUrl}/pagamentos/debito`,
      dados,
      { headers: this.getHeaders() }
    );
  }

  // ── Polling status Pix ──
  consultarStatus(paymentId: number): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(
      `${this.apiUrl}/pagamentos/status/${paymentId}`,
      { headers: this.getHeaders() }
    );
  }

  // ── Saldo ──
  getSaldo(): Observable<SaldoResponse> {
    return this.http.get<SaldoResponse>(
      `${this.apiUrl}/usuario/saldo`,
      { headers: this.getHeaders() }
    ).pipe(
      tap((resp) => {
        if (resp && typeof resp.saldo === 'number') {
          this.setSaldo(resp.saldo);
        }
      })
    );
  }

  setSaldo(novoSaldo: number | null) {
    this.saldoSubject.next(novoSaldo);
  }

  // ── Tickets ──
  getTickets(): Observable<TicketsResponse> {
    return this.http.get<TicketsResponse>(
      `${this.apiUrl}/tickets`,
      { headers: this.getHeaders() }
    );
  }

  comprarTicket(minutos: number, valor: number): Observable<ComprarTicketResponse> {
    return this.http.post<ComprarTicketResponse>(
      `${this.apiUrl}/tickets/comprar`,
      { minutos, valor },
      { headers: this.getHeaders() }
    );
  }
}