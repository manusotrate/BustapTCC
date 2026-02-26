import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TimerPage } from './timer.component';

describe('TimerPage', () => {
  let component: TimerPage;
  let fixture: ComponentFixture<TimerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimerPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with 30 minutes', () => {
    expect(component.ticketMinutes).toBe(30);
  });

  it('should pad numbers correctly', () => {
    expect(component.pad(5)).toBe('05');
    expect(component.pad(12)).toBe('12');
  });
});