import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemDespesasComponent } from './listagem-despesas.component';

describe('ListagemDespesasComponent', () => {
  let component: ListagemDespesasComponent;
  let fixture: ComponentFixture<ListagemDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListagemDespesasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListagemDespesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
