import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
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

export interface UsarTicketResponse {
  mensagem: string;
  distancia_km: number;
}

export interface HistoricoItem {
  id: number;
  origem: string;
  destino: string;
  distancia_km: number;
  usado_em: string;
}

export interface HistoricoResponse {
  historico: HistoricoItem[];
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl;
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

  // ── Comprar Ticket ──
  comprarTicket(distancia_km: number, valor: number): Observable<ComprarTicketResponse> {
    return this.http.post<ComprarTicketResponse>(
      `${this.apiUrl}/tickets/comprar`,
      { distancia_km, valor },
      { headers: this.getHeaders() }
    );
  }

  // ── Usar Ticket (marca como usado e salva no histórico) ──
  usarTicket(ticket_id: number, origem: string, destino: string): Observable<UsarTicketResponse> {
    return this.http.post<UsarTicketResponse>(
      `${this.apiUrl}/tickets/usar`,
      { ticket_id, origem, destino },
      { headers: this.getHeaders() }
    );
  }

  // ── Histórico ──
  getHistorico(): Observable<HistoricoResponse> {
    return this.http.get<HistoricoResponse>(
      `${this.apiUrl}/historico`,
      { headers: this.getHeaders() }
    );
  }
}