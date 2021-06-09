import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { FuncoesService } from 'src/app/services/funcoes.service';

@Component({
  selector: 'app-atualizar-funcao',
  templateUrl: './atualizar-funcao.component.html',
  styleUrls: ['./atualizar-funcao.component.scss']
})
export class AtualizarFuncaoComponent implements OnInit {
  funcaoId: string = '';
  nomeFuncao: string = '';
  formulario: any;
  erros: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private funcoesService: FuncoesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.erros = [];
    this.funcaoId = this.route.snapshot.params.id;

    this.funcoesService.PegarPeloId(this.funcaoId).subscribe((res) => {
      this.nomeFuncao = res.name;

      this.formulario = new FormGroup({
        id: new FormControl(res.id),
        name: new FormControl(res.name, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ]),
        descricao: new FormControl(res.descricao, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ]),
      });
    });
  }

  get propriedade() {
    return this.formulario.controls;
  }

  EnviarFormulario(): void {
    this.erros = [];
    const funcao = this.formulario.value;
    this.funcoesService.AtualizarFuncao(this.funcaoId, funcao).subscribe(
      (res) => {
        this.router.navigate(['/funcao/listagem']);
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
    this.router.navigate(['/funcao/listagem']);
  }
}
