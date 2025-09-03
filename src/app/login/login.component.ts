import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Adicionado standalone
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  ngOnInit() {}

  constructor(private router: Router) {}

  irParaHome() {
    this.router.navigate(['/home']);
  }
}
