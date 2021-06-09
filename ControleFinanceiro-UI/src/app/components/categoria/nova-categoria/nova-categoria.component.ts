import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Tipo } from 'src/app/models/Tipo';
import { CategoriasService } from 'src/app/services/categorias.service';
import { TiposService } from 'src/app/services/tipos.service';

@Component({
  selector: 'app-nova-categoria',
  templateUrl: './nova-categoria.component.html',
  styleUrls: ['./nova-categoria.component.scss']
})
export class NovaCategoriaComponent implements OnInit {

  formulario: any;
  tipos: Tipo[] = [];
  erros: string[] = [];

  constructor(
    private tiposService: TiposService,
    private categoriasService: CategoriasService,
    private router: Router,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.tiposService.PegarTodos().subscribe(res => {
      this.tipos = res;
    });

    this.formulario = new FormGroup({
      nome: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      icone: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
      tipoId: new FormControl(null, [Validators.required]),
    })
  }

  get propriedade () {
    return this.formulario.controls;
  }

  enviarFormulario(): void {
    const categoria = this.formulario.value;
    this.erros = [];
    this.categoriasService.NovaCategoria(categoria).subscribe(res => {
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
