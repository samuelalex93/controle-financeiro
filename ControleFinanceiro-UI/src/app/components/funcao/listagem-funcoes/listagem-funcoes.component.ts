import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FuncoesService } from 'src/app/services/funcoes.service';

@Component({
  selector: 'app-listagem-funcoes',
  templateUrl: './listagem-funcoes.component.html',
  styleUrls: ['./listagem-funcoes.component.scss']
})
export class ListagemFuncoesComponent implements OnInit {
  funcoes= new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  autoCompleteInput = new FormControl();
  opcoesFuncoes: string[] = [];
  nomesFuncoes!: Observable<string[]>;

  @ViewChild(MatPaginator, {static:true})
  paginator!: MatPaginator;

  @ViewChild(MatSort, {static:true})
  sort!: MatSort;

  constructor(
    private funcoesService: FuncoesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.funcoesService.PegarTodos().subscribe(res => {
      res.forEach((funcao) => {
        this.opcoesFuncoes.push(funcao.name);
      });

      this.funcoes.data = res;
      this.funcoes.sort = this.sort;
      this.funcoes.paginator = this.paginator;
    });

    this.displayedColumns = this.ExibirColunas();
    this.nomesFuncoes = this.autoCompleteInput.valueChanges.pipe(startWith(''), map(nome => this.FiltrarFuncoes(nome)));
  }

  FiltrarFuncoes(nome: string): string[] {
    if(nome.trim().length >=4) {
      this.funcoesService.FiltrarFuncao(nome.toLowerCase()).subscribe(res => {
        this.funcoes.data = res;
      });
    }
    else {
      if(nome === '') {
        this.funcoesService.PegarTodos().subscribe(res => {
          this.funcoes.data = res;
        })
      }
    }

    return this.opcoesFuncoes.filter(f =>
      f.toLowerCase().includes(nome.toLowerCase())
    );
  }

  ExibirColunas(): string[] {
    return ['nome', 'descricao', 'acoes'];
  }

  AbrirDialog(funcaoId: string, nome: string):void {
    this.dialog.open(DialogExclusaoFuncoesComponent, {
      data: {
        funcaoId,
        nome
      },
    }).afterClosed().subscribe(res => {
      if(res === true) {
        this.funcoesService.PegarTodos().subscribe(dados => {
          this.funcoes.data = dados;
          this.funcoes.paginator = this.paginator;
        });
        this.ExibirColunas();
      }
    })
  } 
}

@Component({
  selector: 'app-dialog-exclusao-funcoes',
  templateUrl: 'dialog-exclusao-funcoes.html'
})
export class DialogExclusaoFuncoesComponent{
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private funcoesService: FuncoesService,
    private snackBar: MatSnackBar
  ){}

  ExcluirFuncao(funcaoId: string): void {
    this.funcoesService.ExcluirFuncao(funcaoId).subscribe(res => {
      this.snackBar.open(res.mensagem, undefined, {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    });
  }
}
