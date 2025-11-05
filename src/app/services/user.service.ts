import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Usuario {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor() {}

  // Salva os dados do usuário
  setUsuario(usuario: Usuario) {
    this.usuarioSubject.next(usuario);
  }

  // Obtém os dados do usuário atual
  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  // Obtém o nome completo do usuário
  getNomeCompleto(): string {
    const usuario = this.getUsuario();
    if (usuario) {
      return usuario.nome + ' ' + usuario.sobrenome;
    }
    return 'Usuário';
  }

  // Obtém apenas o primeiro nome
  getPrimeiroNome(): string {
    const usuario = this.getUsuario();
    if (usuario) {
      return usuario.nome;
    }
    return 'Usuário';
  }

  // Limpa os dados do usuário (logout)
  clearUsuario() {
    this.usuarioSubject.next(null);
  }

  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    return this.getUsuario() !== null;
  }
}