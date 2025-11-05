import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  mensagem: string;
  token: string;
  usuario: {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
  };
}

interface Usuario {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000';
  private tokenKey = 'auth_token';
  private usuarioKey = 'usuario_data';
  
  // BehaviorSubject para monitorar o estado de autenticação
  private autenticadoSubject = new BehaviorSubject<boolean>(this.hasToken());
  public autenticado$ = this.autenticadoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Verificar se existe token
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Fazer login
  login(cpf: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { cpf, senha })
      .pipe(
        tap(response => {
          // Salvar token e dados do usuário
          this.salvarToken(response.token);
          this.salvarUsuario(response.usuario);
          this.autenticadoSubject.next(true);
        })
      );
  }

  // Fazer logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.autenticadoSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Salvar token
  private salvarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Salvar dados do usuário
  private salvarUsuario(usuario: Usuario): void {
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  // Obter token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Obter dados do usuário armazenados
  getUsuarioLocal(): Usuario | null {
    const usuario = localStorage.getItem(this.usuarioKey);
    return usuario ? JSON.parse(usuario) : null;
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  // Validar token no backend
  validarToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/validar-token`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obter dados do usuário do backend
  obterUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario`, {
      headers: this.getAuthHeaders()
    });
  }

  // Headers com autorização
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}