import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
  userName = 'Maicon';
  balance = 'R$00,00';

  constructor() {}
}
//Esta classe vai virar a váriavel que se adaptará para o nome do usuário e o saldo.