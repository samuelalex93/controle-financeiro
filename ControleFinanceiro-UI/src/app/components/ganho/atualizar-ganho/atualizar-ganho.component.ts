import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/models/Categoria';
import { Ganho } from 'src/app/models/Ganhos';
import { Mes } from 'src/app/models/Mes';
import { CategoriasService } from 'src/app/services/categorias.service';
import { GanhosService } from 'src/app/services/ganhos.service';
import { MesService } from 'src/app/services/mes.service';

@Component({
  selector: 'app-atualizar-ganho',
  templateUrl: './atualizar-ganho.component.html',
  styleUrls: ['./atualizar-ganho.component.scss']
})
export class AtualizarGanhoComponent implements OnInit {
  ganho!: Observable<Ganho>;
  ganhoId: number = 0;
  valorGanho: number = 0;
  categorias: Categoria[] = [];
  meses: Mes[] = [];
  formulario: any;
  erros: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ganhosService: GanhosService,
    private categoriasService: CategoriasService,
    private mesesService: MesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.erros = [];
    this.ganhoId = this.route.snapshot.params.id;

    this.categoriasService.FiltrarCategoriasGanhos().subscribe((res) => {
      this.categorias = res;
    });

    this.mesesService.PegarTodos().subscribe((res) => {
      this.meses = res;
    });

    this.ganhosService.PegarGanhoPeloId(this.ganhoId).subscribe((res) => {
      this.valorGanho = res.valor;

      this.formulario = new FormGroup({
        ganhoId: new FormControl(res.ganhoId),
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
    const ganho = this.formulario.value;
    this.ganhosService.AtualizarGanho(this.ganhoId, ganho).subscribe(
      (res) => {
        this.router.navigate(['/ganho/listagem']);
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
    this.router.navigate(['/ganho/listagem']);
  }
}