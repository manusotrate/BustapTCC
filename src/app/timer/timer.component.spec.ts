import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  standalone: false
})
export class TimerPage implements OnInit, OnDestroy {

  ticketMinutes: number = 30;
  remainingSeconds: number = 0;
  timeDisplay: string = '00:00:00';

  private interval: any;

  alertaMostrado = false;
  expiradoMostrado = false;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {

    const minutos = this.route.snapshot.queryParamMap.get('minutos');

    if (minutos) {
      const parsed = parseInt(minutos, 10);

      if (!isNaN(parsed) && parsed > 0) {
        this.ticketMinutes = parsed;
      }
    }

    this.remainingSeconds = this.ticketMinutes * 60;

    this.updateDisplay();
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  startTimer() {

    this.clearTimer();

    this.interval = setInterval(() => {

      if (this.remainingSeconds > 0) {

        this.remainingSeconds--;

        // AVISO DE 5 MINUTOS
        if (this.remainingSeconds <= 300 && !this.alertaMostrado) {
          this.alertaMostrado = true;
          this.mostrarAviso5Min();
        }

        this.updateDisplay();

      } else {

        // AVISO DE EXPIRAÇÃO
        if (!this.expiradoMostrado) {
          this.expiradoMostrado = true;
          this.mostrarExpirado();
        }

        this.clearTimer();
      }

    }, 1000);
  }

  async mostrarAviso5Min() {

    const toast = await this.toastController.create({
      message: '⚠️ Seu ticket está perto de acabar! Menos de 5 minutos restantes.',
      duration: 4000,
      position: 'top',
      color: 'warning'
    });

    await toast.present();
  }

  async mostrarExpirado() {

    const toast = await this.toastController.create({
      message: '⛔ Seu ticket expirou.',
      duration: 5000,
      position: 'top',
      color: 'danger'
    });

    await toast.present();
  }

  updateDisplay() {

    const hours = Math.floor(this.remainingSeconds / 3600);
    const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
    const seconds = this.remainingSeconds % 60;

    this.timeDisplay =
      this.pad(hours) + ':' + this.pad(minutes) + ':' + this.pad(seconds);
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  clearTimer() {

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

  }

  goBack() {
    this.navCtrl.back();
  }
}