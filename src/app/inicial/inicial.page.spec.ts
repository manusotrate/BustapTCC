import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicialPage } from './inicial.page';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

describe('InicialPage', () => {
  let component: InicialPage;
  let fixture: ComponentFixture<InicialPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicialPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to signup page', () => {
    spyOn(component['router'], 'navigate');
    component.navigateToSignup();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/signup']);
  });

  it('should navigate to login page', () => {
    spyOn(component['router'], 'navigate');
    component.navigateToLogin();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/login']);
  });
});