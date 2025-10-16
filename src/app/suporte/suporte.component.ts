import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-suporte',
  templateUrl: './suporte.component.html',
  styleUrls: ['./suporte.component.scss'],
})
export class SuporteComponent {
  
  constructor(private navCtrl: NavController) {}
  
  voltarOuAcao() {
    console.log('Botão clicado!');
  }
}
