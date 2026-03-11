import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComprarTicketsPage } from './comprar-tickets.page';

describe('ComprarTicketsPage', () => {
  let component: ComprarTicketsPage;
  let fixture: ComponentFixture<ComprarTicketsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprarTicketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
