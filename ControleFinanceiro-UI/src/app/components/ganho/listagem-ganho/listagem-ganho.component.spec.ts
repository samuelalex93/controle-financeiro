import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemGanhoComponent } from './listagem-ganho.component';

describe('ListagemGanhoComponent', () => {
  let component: ListagemGanhoComponent;
  let fixture: ComponentFixture<ListagemGanhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListagemGanhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListagemGanhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
