import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';

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

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
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
        this.updateDisplay();
      } else {
        this.clearTimer();
      }
    }, 1000);
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