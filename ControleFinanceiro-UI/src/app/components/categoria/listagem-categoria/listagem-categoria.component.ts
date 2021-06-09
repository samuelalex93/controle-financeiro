import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CategoriasService } from 'src/app/services/categorias.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listagem-categoria',
  templateUrl: './listagem-categoria.component.html',
  styleUrls: ['./listagem-categoria.component.scss']
})
export class ListagemCategoriaComponent implements OnInit {

  categoria = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  autoCompleteInput = new FormControl();
  opcoesCategorias: string[] = [];
  nomesCategorias!: Observable<string[]>;

  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort!: MatSort;

  constructor(
    private service: CategoriasService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.service.PegarTodos()
      .subscribe(res => {
        res.forEach((e)=>{
          this.opcoesCategorias.push(e.nome);
        });

        this.categoria.data = res;
        this.categoria.paginator = this.paginator;
        this.categoria.sort = this.sort;
      });

      this.displayedColumns = this.ExibirColunas();
      this.nomesCategorias = this.autoCompleteInput.valueChanges.pipe(startWith(''),map(nome => this.FiltarNomes(nome)));
  }

  ExibirColunas(): string[] {
    return ['nome', 'icone', 'tipo', 'acoes'];
  }

  AbrirDialog(categoriaId: number, nome: string): void {
    this.dialog.open(DialogExclusaoCategoriasComponent, {
      data: {
        categoriaId: categoriaId,
        nome: nome
      }
    }).afterClosed().subscribe(res => {
      if( res === true) {
        this.service.PegarTodos().subscribe((dados) => {
          this.categoria.data = dados;
        });

        this.displayedColumns = this.ExibirColunas();
      }
    });
  }

  FiltarNomes(nome: string): string[] {
    if(nome.trim().length >= 4) {
      this.service.FiltrarCategorias(nome.toLowerCase()).subscribe(res => {
        this.categoria.data = res;
      })
    } else {
      if(nome === '') {
        this.service.PegarTodos().subscribe(res => {
          this.categoria.data = res;
        });
      }
    }
    
    return this.opcoesCategorias.filter(c => 
      c.toLowerCase().includes(nome.toLowerCase())
    );
    
  }
}

@Component({
  selector: 'app-dialog-exclusao-categorias',
  templateUrl: 'dialog-exclusao-categorias.html'
})
export class DialogExclusaoCategoriasComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dados: any,
    private service: CategoriasService,
    private snackBar: MatSnackBar
  ) {}

  ExcluirCategoria(categoriaId: number): void {
    this.service.ExcluirCategoria(categoriaId).subscribe((res: any) => {
      this.snackBar.open(res.mensagem, undefined, {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    });
  }
}
