import { Component, OnInit } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
