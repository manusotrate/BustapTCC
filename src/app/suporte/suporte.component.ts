import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-suporte',
  templateUrl: './suporte.component.html',
  styleUrls: ['./suporte.component.scss'],
  standalone: false
})
export class SuporteComponent {
  copiado = false;

  constructor(private navCtrl: NavController) {}

  copiarEmail() {
    navigator.clipboard.writeText('suportebustap@gmail.com').then(() => {
      this.copiado = true;
      setTimeout(() => this.copiado = false, 2500);
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  voltarOuAcao() {
    console.log('Botão clicado!');
  }
}