import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-suporte',
  templateUrl: './suporte.component.html',
  styleUrls: ['./suporte.component.scss'],
  standalone: false
})
export class SuporteComponent {

  constructor(private navCtrl: NavController) {}

  goBack() {
    this.navCtrl.back();
  }

  voltarOuAcao() {
    console.log('Botão clicado!');
  }
}