import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recarga',
  templateUrl: './recarga.component.html',
  styleUrls: ['./recarga.component.scss'],
  standalone: false
})
export class RecargaComponent {

  private digitos: string = '0';

  constructor(private router: Router) {}

  get valorFormatado(): string {
    const num = parseInt(this.digitos, 10);
    const reais = Math.floor(num / 100);
    const centavos = num % 100;
    return `R$\u00a0${reais.toLocaleString('pt-BR')},${centavos.toString().padStart(2, '0')}`;
  }

  get valorNumerico(): number {
    return parseInt(this.digitos, 10) / 100;
  }

  digitarNumero(num: string) {
    if (this.digitos === '0') {
      this.digitos = num;
    } else {
      if (this.digitos.length >= 9) return;
      this.digitos += num;
    }
  }

  apagar() {
    if (this.digitos.length <= 1) {
      this.digitos = '0';
    } else {
      this.digitos = this.digitos.slice(0, -1);
    }
  }

  continuar() {
    if (this.valorNumerico === 0) return;
    console.log('Valor para recarga:', this.valorNumerico);
    // this.router.navigate(['/pagamento'], { queryParams: { valor: this.valorNumerico } });
  }
}