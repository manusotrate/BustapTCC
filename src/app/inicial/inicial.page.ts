import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
  standalone: false
})
export class InicialPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Inicialização da página
  }

  navigateToSignup() {
    // Navegar para a página de cadastro
    this.router.navigate(['/cadastro']);
  }

  navigateToLogin() {
    // Navegar para a página de login
    this.router.navigate(['/login']);
  }

}
