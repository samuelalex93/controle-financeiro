import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CartoesService } from 'src/app/services/cartoes.service';

@Component({
  selector: 'app-listagem-cartoes',
  templateUrl: './listagem-cartoes.component.html',
  styleUrls: ['./listagem-cartoes.component.scss']
})
export class ListagemCartoesComponent implements OnInit {
  cartoes = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  usuarioId: any = localStorage.getItem('UsuarioId');
  autoCompleteInput = new FormControl();
  opcoesNumeros: string[] = [];
  numeroCartoes!: Observable<string[]>;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(
    private cartoesService: CartoesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cartoesService
      .PegarCartoesPeloUsuarioId(this.usuarioId)
      .subscribe(res => {
        res.forEach((numero: any) => {
          this.opcoesNumeros.push(numero.numero);
        });

        this.cartoes.data = res;
        this.cartoes.paginator = this.paginator;
        this.cartoes.sort = this.sort;
      });

    this.displayedColumns = this.ExibirColunas();

    this.numeroCartoes = this.autoCompleteInput.valueChanges.pipe(
      startWith(''),
      map(numero => this.FiltrarCartoes(numero))
    );
  }

  ExibirColunas(): string[] {
    return ['nome', 'bandeira', 'numero', 'limite', 'acoes'];
  }

  FiltrarCartoes(numero: string): string[] {
    if (numero.trim().length >= 4) {
      this.cartoesService.FiltrarCartoes(numero).subscribe(res => {
        this.cartoes.data = res;
      });
    } else {
      if (numero === '') {
        this.cartoesService
          .PegarCartoesPeloUsuarioId(this.usuarioId)
          .subscribe(res => {
            this.cartoes.data = res;
          });
      }
    }

    return this.opcoesNumeros.filter((nc) =>
      nc.toLowerCase().includes(numero.toLowerCase())
    );
  }

  AbrirDialog(cartaoId: number, numero: number): void {
    this.dialog
      .open(DialogExclusaoCartoesComponent, {
        data: {
          cartaoId: cartaoId,
          numero: numero,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === true) {
          this.cartoesService
            .PegarCartoesPeloUsuarioId(this.usuarioId)
            .subscribe((dados) => {
              this.cartoes.data = dados;
              this.cartoes.paginator = this.paginator;
            });
          this.displayedColumns = this.ExibirColunas();
        }
      });
  }
}

@Component({
  selector: 'app-dialog-exclusao-cartoes',
  templateUrl: 'dialog-exclusao-cartoes.html',
})
export class DialogExclusaoCartoesComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dados: any,
    private cartoesService: CartoesService,
    private snackBar: MatSnackBar
  ) {}

  ExcluirCartao(cartaoId: number): void {
    this.cartoesService.ExcluirCartao(cartaoId).subscribe(res => {
      this.snackBar.open(res.mensagem, undefined, {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }
}
