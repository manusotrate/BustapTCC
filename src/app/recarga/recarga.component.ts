import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recarga',
  templateUrl: './recarga.component.html',
  styleUrls: ['./recarga.component.scss'],
  standalone: false
})
export class RecargaComponent {

  @ViewChild('valorInput') valorInput!: ElementRef<HTMLInputElement>;
  private digitos: string = '0';

  constructor(
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  get valorFormatado(): string {
    const num = parseInt(this.digitos, 10);
    const reais = Math.floor(num / 100);
    const centavos = num % 100;
    return `R$\u00a0${reais.toLocaleString('pt-BR')},${centavos.toString().padStart(2, '0')}`;
  }

  get valorNumerico(): number {
    return parseInt(this.digitos, 10) / 100;
  }

  adicionarValor(reais: number) {
    const atual = parseInt(this.digitos, 10);
    const novo = atual + reais * 100;
    if (novo > 999999999) return;
    this.digitos = novo.toString();
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 9);
    this.digitos = digits || '0';
    input.value = this.valorFormatado;
  }

  async continuar() {
    if (this.valorNumerico < 1) {
      const toast = await this.toastCtrl.create({
        message: 'Valor mínimo para recarga é R$1,00.',
        duration: 2500,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }

    this.router.navigate(['/recarga/metodo'], {
      queryParams: { valor: this.valorNumerico }
    });
  }
}