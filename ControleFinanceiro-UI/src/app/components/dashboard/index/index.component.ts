import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  qtdCartoes: number = 0;
  ganhoTotal: number = 0;
  despesaTotal: number = 0;
  saldo: number = 0;
  anoAtual: number = new Date().getFullYear();
  anoInicial: number = this.anoAtual - 10;
  anos: number[] = [];

  usuarioId: any = localStorage.getItem('UsuarioId');

  dados: ChartDataSets [] = [];
  labels: Label[] = [];
  opcoes: ChartOptions = {
    responsive: true,
    legend: {
      labels: {
        usePointStyle: true,
      },
    },
  };
  plugins = [];
  tipo: ChartType = 'line';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService
      .PegarDadosCardsDashboard(this.usuarioId)
      .subscribe((res) => {
        this.qtdCartoes = res.qtdCartoes;
        this.ganhoTotal = res.ganhoTotal;
        this.despesaTotal = res.despesaTotal;
        this.saldo = res.saldo;
      });

    this.anos = this.CarregarAnos(this.anoInicial, this.anoAtual);

    this.dashboardService
      .PegarDadosAnuaisPeloUsuarioId(this.usuarioId, this.anoAtual)
      .subscribe((res) => {
        this.labels = this.RetornarMeses(res.meses);

        this.dados = [
          {
            data: this.RetornarValoresGanhos(res.meses, res.ganhos),
            label: 'Ganho de R$',
            fill: false,
            borderColor: '#27ae60',
            backgroundColor: '#27ae60',
            pointBackgroundColor: '#27ae60',
            pointBorderColor: '#27ae60',
            pointHoverBackgroundColor: '#27ae60',
            pointHoverBorderColor: '#27ae60',
          },

          {
            data: this.RetornarValoresDespesas(
              res.meses,
              res.despesas
            ),
            label: 'Despesa de R$',
            fill: false,
            borderColor: '#c0392b',
            backgroundColor: '#c0392b',
            pointBackgroundColor: '#c0392b',
            pointBorderColor: '#c0392b',
            pointHoverBackgroundColor: '#c0392b',
            pointHoverBorderColor: '#c0392b',
          },
        ];
      });
  }

  CarregarAnos(anoInicial: number, anoAtual: number): number[] {
    const anos = [];

    while (anoInicial <= anoAtual) {
      anos.push(anoInicial);
      anoInicial = anoInicial + 1;
    }

    return anos;
  }

  RetornarMeses(dadosMeses: any): string[] {
    const meses = [];
    let indice = 0;
    const qtdMeses = dadosMeses.length;

    while (indice < qtdMeses) {
      meses.push(dadosMeses[indice].nome);
      indice = indice + 1;
    }

    return meses;
  }

  RetornarValoresGanhos(dadosMeses: any, dadosGanhos: any): number[] {
    const valores = [];
    let indiceMeses = 0;
    let indiceGanhos = 0;
    const qtdMeses = dadosMeses.length;
    const qtdGanhos = dadosGanhos.length;

    while (indiceMeses <= qtdMeses - 1) {
      if (indiceGanhos <= qtdGanhos - 1) {
        if (dadosGanhos[indiceGanhos].mesId === dadosMeses[indiceMeses].mesId) {
          valores.push(dadosGanhos[indiceGanhos].valores);
          indiceGanhos = indiceGanhos + 1;
          indiceMeses = indiceMeses + 1;
        } else {
          valores.push(0);
          indiceMeses = indiceMeses + 1;
        }
      } else {
        valores.push(0);
        indiceMeses = indiceMeses + 1;
      }
    }

    return valores;
  }

  RetornarValoresDespesas(dadosMeses: any, dadosDespesas: any): number[] {
    const valores = [];
    let indiceMeses = 0;
    let indiceDespesas = 0;
    const qtdMeses = dadosMeses.length;
    const qtdDespesas = dadosDespesas.length;

    while (indiceMeses <= qtdMeses - 1) {
      if (indiceDespesas <= qtdDespesas - 1) {
        if (
          dadosDespesas[indiceDespesas].mesId === dadosMeses[indiceMeses].mesId
        ) {
          valores.push(dadosDespesas[indiceDespesas].valores);
          indiceDespesas = indiceDespesas + 1;
          indiceMeses = indiceMeses + 1;
        } else {
          valores.push(0);
          indiceMeses = indiceMeses + 1;
        }
      } else {
        valores.push(0);
        indiceMeses = indiceMeses + 1;
      }
    }

    return valores;
  }

  CarregarDados(anoSelecionado: number): void {
    this.dashboardService
      .PegarDadosAnuaisPeloUsuarioId(this.usuarioId, anoSelecionado)
      .subscribe((res) => {
        this.labels = this.RetornarMeses(res.meses);

        this.dados = [
          {
            data: this.RetornarValoresGanhos(res.meses, res.ganhos),
            label: 'Ganho de R$',
            fill: false,
            borderColor: '#27ae60',
            backgroundColor: '#27ae60',
            pointBackgroundColor: '#27ae60',
            pointBorderColor: '#27ae60',
            pointHoverBackgroundColor: '#27ae60',
            pointHoverBorderColor: '#27ae60',
          },

          {
            data: this.RetornarValoresDespesas(
              res.meses,
              res.despesas
            ),
            label: 'Despesa de R$',
            fill: false,
            borderColor: '#c0392b',
            backgroundColor: '#c0392b',
            pointBackgroundColor: '#c0392b',
            pointBorderColor: '#c0392b',
            pointHoverBackgroundColor: '#c0392b',
            pointHoverBorderColor: '#c0392b',
          },
        ];
      });
  }
}
