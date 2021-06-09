import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Categoria } from 'src/app/models/Categoria';
import { Tipo } from 'src/app/models/Tipo';
import { CategoriasService } from 'src/app/services/categorias.service';
import { TiposService } from 'src/app/services/tipos.service';

@Component({
  selector: 'app-atualizar-categoria',
  templateUrl: './atualizar-categoria.component.html',
  styleUrls: ['./atualizar-categoria.component.scss']
})
export class AtualizarCategoriaComponent implements OnInit {
  nomeCategoria: string = '';
  categoriaId!: number;

  categoria!: Observable<Categoria>;
  tipos: Tipo[] = [];
  formulario: any;
  erros: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tiposService: TiposService,
    private categoriasService: CategoriasService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const categoriaId = this.route.snapshot.params.id;
    this.tiposService.PegarTodos().subscribe(res => {
      this.tipos = res;
    });

    this.categoriasService.PegarCateregoriaPeloId(categoriaId).subscribe((res: any) => {
      this.nomeCategoria = res.nome;
      this.categoriaId = res.categoriaId;
      this.formulario = new FormGroup({
        categoriaId: new FormControl(res.categoriaId),
        nome: new FormControl(res.nome, [Validators.required, Validators.maxLength(50)]),
        icone: new FormControl(res.icone, [Validators.required, Validators.maxLength(15)]),
        tipoId: new FormControl(res.tipoId, [Validators.required])
      });
    })
  }

  get propriedade() {
    return this.formulario.controls;
  }

  enviarFormulario(): void {
    const categoria = this.formulario.value;
    this.erros = [];
    this.categoriasService.AtualizarCategoria(this.categoriaId, categoria).subscribe(res => {
      this.router.navigate(['categoria/listagem']);
      this.snackBar.open(res.mensagem, undefined, {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    },
    (err) => {
      if(err.status === 400) {
        for(const campo in err.error.errors){
          if(err.error.errors.hasOwnProperty(campo)) {
            this.erros.push(err.error.errors[campo]);
          }
        }
      }
    });
  }
}
