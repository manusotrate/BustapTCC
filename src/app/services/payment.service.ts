import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface PreferenciaResponse {
  preferenceId: string;
  checkoutUrl: string;
  checkoutUrlSandbox: string;
}

interface SaldoResponse {
  saldo: number;
}

interface TicketItem {
  id: number;
  minutos: number;
  valor: number;
  status: string;
}

interface TicketsResponse {
  tickets: TicketItem[];
}

interface ComprarTicketResponse {
  mensagem: string;
  saldo: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:4000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  criarPreferencia(valor: number): Observable<PreferenciaResponse> {
    return this.http.post<PreferenciaResponse>(
      `${this.apiUrl}/pagamentos/preferencia`,
      { valor },
      { headers: this.getHeaders() }
    );
  }

  getSaldo(): Observable<SaldoResponse> {
    return this.http.get<SaldoResponse>(
      `${this.apiUrl}/usuario/saldo`,
      { headers: this.getHeaders() }
    );
  }

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