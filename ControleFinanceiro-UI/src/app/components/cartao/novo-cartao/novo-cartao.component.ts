import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartoesService } from 'src/app/services/cartoes.service';

@Component({
  selector: 'app-novo-cartao',
  templateUrl: './novo-cartao.component.html',
  styleUrls: ['./novo-cartao.component.scss']
})
export class NovoCartaoComponent implements OnInit {

  formulario: any;
  erros: string[] = [];
  usuarioId: any = localStorage.getItem('UsuarioId');

  constructor(
    private cartoesService: CartoesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.erros = [];

    this.formulario = new FormGroup({
      nome: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20),
      ]),
      bandeira: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(15),
      ]),
      numero: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20),
      ]),
      limite: new FormControl(null, [Validators.required]),
      usuarioId: new FormControl(this.usuarioId),
    });
  }

  get propriedade() {
    return this.formulario.controls;
  }

  VoltarListagem(): void {
    this.router.navigate(['cartao/listagem']);
  }

  EnviarFormulario() : void {
    this.erros = [];
    const cartao = this.formulario.value;

    this.cartoesService.NovoCartao(cartao).subscribe(res => {
      this.router.navigate(['cartao/listagem']);
      this.snackBar.open(res.mensagem, undefined, {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
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
    });
  }
}
