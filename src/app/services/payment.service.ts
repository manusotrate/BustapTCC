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

  // Cria preferência no MP e retorna a URL de checkout
  criarPreferencia(valor: number): Observable<PreferenciaResponse> {
    return this.http.post<PreferenciaResponse>(
      `${this.apiUrl}/pagamentos/preferencia`,
      { valor },
      { headers: this.getHeaders() }
    );
  }

  // Busca saldo atualizado após pagamento
  getSaldo(): Observable<SaldoResponse> {
    return this.http.get<SaldoResponse>(
      `${this.apiUrl}/usuario/saldo`,
      { headers: this.getHeaders() }
    );
  }
}