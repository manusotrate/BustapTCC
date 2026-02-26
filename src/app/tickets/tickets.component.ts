import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  standalone: false
})
export class TicketsComponent implements OnInit {

  usuario: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.carregarUsuario();
  }

  carregarUsuario() {
    const token = localStorage.getItem('token');

    this.http.get('http://localhost:4000/usuarios', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe((res: any) => {
      this.usuario = res.usuario;
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  historico() {
    this.router.navigate(['/historico']);
  }

  home() {
    this.router.navigate(['/home']);
  }


} 