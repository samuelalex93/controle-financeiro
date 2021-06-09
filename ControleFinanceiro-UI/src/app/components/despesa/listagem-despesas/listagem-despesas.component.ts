import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DespesasService } from 'src/app/services/despesas.service';

@Component({
  selector: 'app-listagem-despesas',
  templateUrl: './listagem-despesas.component.html',
  styleUrls: ['./listagem-despesas.component.scss']
})
export class ListagemDespesasComponent implements OnInit {
  despesas = new MatTableDataSource<any>();
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
    private despesasService: DespesasService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.despesasService
      .PegarDespesasPeloUsuarioId(this.usuarioId)
      .subscribe((res) => {
        res.forEach((despesa) => {
          this.opcoesCategorias.push(despesa.categoria.nome);
        });

        this.despesas.data = res;
        this.despesas.paginator = this.paginator;
        this.despesas.sort = this.sort;
      });

    this.displayedColumns = this.ExibirColunas();

    this.nomesCategorias = this.autoCompleteInput.valueChanges.pipe(
      startWith(''),
      map((nome: string) => this.FiltrarCategorias(nome))
    );
  }

  ExibirColunas(): string[] {
    return ['numero', 'descricao', 'categoria', 'valor', 'data', 'acoes'];
  }

  FiltrarCategorias(nomeCategoria: string): string[] {
    if (nomeCategoria.trim().length >= 4) {
      this.despesasService
        .FiltrarDespesas(nomeCategoria.toLowerCase())
        .subscribe((res) => {
          this.despesas.data = res;
        });
    } else {
      if (nomeCategoria === '') {
        this.despesasService
          .PegarDespesasPeloUsuarioId(this.usuarioId)
          .subscribe((res) => {
            this.despesas.data = res;
          });
      }
    }

    return this.opcoesCategorias.filter((despesa) =>
      despesa.toLowerCase().includes(nomeCategoria.toLowerCase())
    );
  }

  AbrirDialog(despesaId: number, valor: number): void {
    this.dialog
      .open(DialogExclusaoDespesasComponent, {
        data: {
          despesaId: despesaId,
          valor: valor,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === true) {
          this.despesasService
            .PegarDespesasPeloUsuarioId(this.usuarioId)
            .subscribe((registros) => {
              this.despesas.data = registros;
              this.despesas.paginator = this.paginator;
            });
          this.displayedColumns = this.ExibirColunas();
        }
      });
  }
}

@Component({
  selector: 'app-dialog-exclusao-despesas',
  templateUrl: './dialog-exclusao-despesas.html',
})
export class DialogExclusaoDespesasComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private despesasService: DespesasService,
    private snackBar: MatSnackBar
  ) {}

  ExcluirDespesa(despesaId: number): void {
    this.despesasService.ExcluirDespesa(despesaId).subscribe((res) => {
      this.snackBar.open(res.mensagem, undefined, {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }
}
