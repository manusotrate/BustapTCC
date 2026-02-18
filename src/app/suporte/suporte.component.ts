import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suporte',
  templateUrl: './suporte.component.html',
  styleUrls: ['./suporte.component.scss']
  ,
  standalone: false
})
export class SuporteComponent {
  
  constructor(private navCtrl: NavController) {}
  
  voltarOuAcao() {
    console.log('Botão clicado!');
  }
}