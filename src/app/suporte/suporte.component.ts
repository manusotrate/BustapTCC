import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-suporte',
  templateUrl: './suporte.component.html',
  styleUrls: ['./suporte.component.scss'],
  standalone: false
})
export class SuporteComponent {
<<<<<<< HEAD
  copiado = false;

  constructor(private navCtrl: NavController) {}

  copiarEmail() {
    navigator.clipboard.writeText('suportebustap@gmail.com').then(() => {
      this.copiado = true;
      setTimeout(() => this.copiado = false, 2500);
    });
=======

  constructor(private navCtrl: NavController) {}

  goBack() {
    this.navCtrl.back();
>>>>>>> 37dc7820643366113e1715aff630aabec6d92d8b
  }

  voltarOuAcao() {
    console.log('Botão clicado!');
  }
}