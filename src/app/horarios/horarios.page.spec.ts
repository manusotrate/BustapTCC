import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { HorariosPage } from './horarios.page';

describe('HorariosPage', () => {
  let component: HorariosPage;
  let fixture: ComponentFixture<HorariosPage>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    alertSpy.create.and.returnValue(
      Promise.resolve({ present: () => Promise.resolve() } as any)
    );

    await TestBed.configureTestingModule({
      declarations: [HorariosPage],
      imports: [IonicModule.forRoot(), RouterTestingModule, FormsModule],
      providers: [{ provide: AlertController, useValue: alertSpy }],
    }).compileComponents();

    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    fixture = TestBed.createComponent(HorariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com tempo estimado vazio', () => {
    expect(component.tempoEstimado).toBe('');
  });

  it('deve iniciar sem cidades selecionadas', () => {
    expect(component.localPartida).toBeNull();
    expect(component.localChegada).toBeNull();
  });

  it('deve ter 28 cidades disponíveis', () => {
    expect(component.cidades.length).toBe(28);
  });

  it('deve conter Marília na lista de cidades', () => {
    const marilia = component.cidades.find(c => c.nome === 'Marília');
    expect(marilia).toBeTruthy();
    expect(marilia?.distanciaDeMarilia).toBe(0);
  });

  it('deve chamar AlertController ao abrir seletor de partida', async () => {
    await component.abrirSeletor('partida');
    expect(alertControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ header: 'Local de partida' })
    );
  });

  it('deve chamar AlertController ao abrir seletor de chegada', async () => {
    await component.abrirSeletor('chegada');
    expect(alertControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ header: 'Local de chegada' })
    );
  });

  it('deve retornar 0min quando partida e chegada são iguais', () => {
    const cidade = component.cidades.find(c => c.nome === 'Marília')!;
    component.localPartida = cidade;
    component.localChegada = cidade;
    component.calcularTempo();
    expect(component.tempoEstimado).toBe('0min');
  });

  it('deve calcular tempo em minutos para cidades próximas', () => {
    component.localPartida = component.cidades.find(c => c.nome === 'Marília')!;
    component.localChegada = component.cidades.find(c => c.nome === 'Oriente')!;
    component.calcularTempo();
    expect(component.tempoEstimado).toContain('min');
    expect(component.tempoEstimado).not.toContain('h');
  });

  it('deve calcular tempo em horas para cidades distantes', () => {
    component.localPartida = component.cidades.find(c => c.nome === 'Marília')!;
    component.localChegada = component.cidades.find(c => c.nome === 'Rinópolis')!;
    component.calcularTempo();
    expect(component.tempoEstimado).toContain('h');
  });

  it('deve limpar tempo estimado ao desselecionar cidade', () => {
    component.localPartida = component.cidades.find(c => c.nome === 'Marília')!;
    component.localChegada = null;
    component.calcularTempo();
    expect(component.tempoEstimado).toBe('');
  });

  it('compararCidade deve retornar true para cidades iguais', () => {
    const c1 = { nome: 'Garça', distanciaDeMarilia: 34 };
    const c2 = { nome: 'Garça', distanciaDeMarilia: 34 };
    expect(component.compararCidade(c1, c2)).toBeTrue();
  });

  it('compararCidade deve retornar false para cidades diferentes', () => {
    const c1 = { nome: 'Garça', distanciaDeMarilia: 34 };
    const c2 = { nome: 'Tupã', distanciaDeMarilia: 68 };
    expect(component.compararCidade(c1, c2)).toBeFalse();
  });
});