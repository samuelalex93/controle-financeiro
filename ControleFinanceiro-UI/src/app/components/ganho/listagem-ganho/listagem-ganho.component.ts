import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GanhosService } from 'src/app/services/ganhos.service';

@Component({
  selector: 'app-listagem-ganho',
  templateUrl: './listagem-ganho.component.html',
  styleUrls: ['./listagem-ganho.component.scss']
})
export class ListagemGanhoComponent implements OnInit {
  ganhos = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  usuarioId: any = localStorage.getItem('UsuarioId');
  autoCompleteInput = new FormControl();
  opcoesCategorias: string[] = [];
  nomesCategorias!: Observable<string[]>;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(
    private ganhosService: GanhosService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ganhosService
      .PegarGanhosPeloUsuarioId(this.usuarioId)
      .subscribe((res) => {
        res.forEach((ganho) => {
          this.opcoesCategorias.push(ganho.categoria.nome);
        });
        this.ganhos.data = res;
        this.ganhos.paginator = this.paginator;
        this.ganhos.sort = this.sort;
      });

    this.displayedColumns = this.ExibirColunas();

    this.nomesCategorias = this.autoCompleteInput.valueChanges.pipe(
      startWith(''),
      map((nome: string) => this.FiltrarCategorias(nome))
    );
  }

  ExibirColunas(): string[] {
    return ['descricao', 'categoria', 'valor', 'data', 'acoes'];
  }

  FiltrarCategorias(nomeCategoria: string): string[] {
    if (nomeCategoria.trim().length >= 4) {
      this.ganhosService
        .FiltrarGanhos(nomeCategoria.toLowerCase())
        .subscribe((res) => {
          this.ganhos.data = res;
        });
    } else {
      if (nomeCategoria === '') {
        this.ganhosService
          .PegarGanhosPeloUsuarioId(this.usuarioId)
          .subscribe((res) => {
            this.ganhos.data = res;
          });
      }
    }

    return this.opcoesCategorias.filter((nome) =>
      nome.toLowerCase().includes(nomeCategoria.toLowerCase())
    );
  }

  AbrirDialog(ganhoId: number, valor: number): void {
    this.dialog
      .open(DialogExclusaoGanhosComponent, {
        data: {
          ganhoId: ganhoId,
          valor: valor,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === true) {
          this.ganhosService
            .PegarGanhosPeloUsuarioId(this.usuarioId)
            .subscribe((registros) => {
              this.ganhos.data = registros;
              this.ganhos.paginator = this.paginator;
            });
          this.displayedColumns = this.ExibirColunas();
        }
      });
  }
}

@Component({
  selector: 'app-dialog-exclusao-ganhos',
  templateUrl: 'dialog-exclusao-ganhos.html',
})
export class DialogExclusaoGanhosComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ganhosService: GanhosService,
    private snackBar: MatSnackBar
  ) {}

  ExcluirGanho(ganhoId: number): void {
    this.ganhosService.ExcluirGanho(ganhoId).subscribe((res) => {
      this.snackBar.open(res.mensagem, undefined, {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }
}
