import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cartao } from 'src/app/models/Cartao';
import { Categoria } from 'src/app/models/Categoria';
import { Despesa } from 'src/app/models/Despesa';
import { Mes } from 'src/app/models/Mes';
import { CartoesService } from 'src/app/services/cartoes.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { DespesasService } from 'src/app/services/despesas.service';
import { MesService } from 'src/app/services/mes.service';

@Component({
  selector: 'app-atualizar-despesa',
  templateUrl: './atualizar-despesa.component.html',
  styleUrls: ['./atualizar-despesa.component.scss']
})
export class AtualizarDespesaComponent implements OnInit {
  despesa!: Observable<Despesa>;
  valorDespesa: number = 0;
  formulario: any;
  cartoes: Cartao[] = [];
  categorias: Categoria[] = [];
  meses: Mes[] = [];
  erros: string[] = [];
  despesaId: number = 0;
  usuarioId: any = localStorage.getItem('UsuarioId');

  constructor(
    private despesasService: DespesasService,
    private cartoesService: CartoesService,
    private categoriasService: CategoriasService,
    private mesesService: MesService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.erros = [];
    this.despesaId = this.route.snapshot.params.id;

    this.cartoesService
      .PegarCartoesPeloUsuarioId(this.usuarioId)
      .subscribe((res) => {
        this.cartoes = res;
      });

    this.categoriasService
      .FiltrarCategoriasDespesas()
      .subscribe((res) => {
        this.categorias = res;
      });

    this.mesesService.PegarTodos().subscribe((res) => {
      this.meses = res;
    });

    this.despesasService
      .PegarDespesaPeloId(this.despesaId)
      .subscribe((res) => {
        this.valorDespesa = res.valor;

        this.formulario = new FormGroup({
          despesaId: new FormControl(res.despesaId),
          cartaoId: new FormControl(res.cartaoId, [Validators.required]),
          descricao: new FormControl(res.descricao, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(50),
          ]),
          categoriaId: new FormControl(res.categoriaId, [
            Validators.required,
          ]),
          valor: new FormControl(res.valor, [Validators.required]),
          dia: new FormControl(res.dia, [Validators.required]),
          mesId: new FormControl(res.mesId, [Validators.required]),
          ano: new FormControl(res.ano, [Validators.required]),
          usuarioId: new FormControl(res.usuarioId),
        });
      });
  }

  get propriedade() {
    return this.formulario.controls;
  }

  EnviarFormulario(): void {
    this.erros = [];
    const despesa = this.formulario.value;
    this.despesasService.AtualizarDespesa(this.despesaId, despesa).subscribe(
      (res) => {
        this.router.navigate(['despesa/listagem']);
        this.snackBar.open(res.mensagem, undefined, {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      (err) => {
        if (err.status === 400) {
          for (const campo in err.error.errors) {
            if (err.error.errors.hasOwnProperty(campo)) {
              this.erros.push(err.error.errors[campo]);
            }
          }
        }
      }
    );
  }

  VoltarListagem(): void {
    this.router.navigate(['despesa/listagem']);
  }
}
