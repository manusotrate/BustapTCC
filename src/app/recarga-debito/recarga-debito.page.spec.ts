import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecargaDebitoPage } from './recarga-debito.page';

describe('RecargaDebitoPage', () => {
  let component: RecargaDebitoPage;
  let fixture: ComponentFixture<RecargaDebitoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecargaDebitoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
