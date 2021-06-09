import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cartao } from 'src/app/models/Cartao';
import { CartoesService } from 'src/app/services/cartoes.service';

@Component({
  selector: 'app-atualizar-cartao',
  templateUrl: './atualizar-cartao.component.html',
  styleUrls: ['./atualizar-cartao.component.scss']
})
export class AtualizarCartaoComponent implements OnInit {
  formulario: any;
  cartao!: Observable<Cartao>;
  numeroCartao: number = 0;
  cartaoId: number = 0;
  erros: string[] = [];

  constructor(
    private cartoesService: CartoesService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.erros = [];
    this.cartaoId = this.route.snapshot.params.id;

    this.cartoesService
      .PegarCartaoPeloId(this.cartaoId)
      .subscribe(res => {
        this.numeroCartao = res.numero;
        this.formulario = new FormGroup({
          cartaoId: new FormControl(res.cartaoId),
          nome: new FormControl(res.nome, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(20),
          ]),
          bandeira: new FormControl(res.bandeira, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(15),
          ]),
          numero: new FormControl(res.numero, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(20),
          ]),
          limite: new FormControl(res.limite, [Validators.required]),
          usuarioId: new FormControl(res.usuarioId),
        });
      });
  }

  get propriedade() {
    return this.formulario.controls;
  }

  VoltarListagem(): void {
    this.router.navigate(['cartao/listagem']);
  }

  EnviarFormulario(): void {
    this.erros = [];
    const cartao = this.formulario.value;

    this.cartoesService
      .AtualizarCartao(this.cartaoId, cartao)
      .subscribe(res => {
        this.router.navigate(['cartao/listagem']);
        this.snackBar.open(res.mensagem, undefined, {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
  }
}
