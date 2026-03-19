import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecargaPixPage } from './recarga-pix.page';

describe('RecargaPixPage', () => {
  let component: RecargaPixPage;
  let fixture: ComponentFixture<RecargaPixPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecargaPixPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
