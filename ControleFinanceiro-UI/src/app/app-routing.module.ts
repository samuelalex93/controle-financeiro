import { NovaDespesaComponent } from './components/despesa/nova-despesa/nova-despesa.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListagemCategoriaComponent } from './components/categoria/listagem-categoria/listagem-categoria.component';
import { NovaCategoriaComponent } from './components/categoria/nova-categoria/nova-categoria.component';
import { AtualizarCategoriaComponent } from './components/categoria/atualizar-categoria/atualizar-categoria.component';
import { ListagemFuncoesComponent } from './components/funcao/listagem-funcoes/listagem-funcoes.component';
import { NovaFuncaoComponent } from './components/funcao/nova-funcao/nova-funcao.component';
import { AtualizarFuncaoComponent } from './components/funcao/atualizar-funcao/atualizar-funcao.component';
import { RegistrarUsuarioComponent } from './components/usuario/registro/registrar-usuario/registrar-usuario.component';
import { LoginUsuarioComponent } from './components/usuario/login/login-usuario/login-usuario.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NovoCartaoComponent } from './components/cartao/novo-cartao/novo-cartao.component';
import { AtualizarCartaoComponent } from './components/cartao/atualizar-cartao/atualizar-cartao.component';
import { ListagemCartoesComponent } from './components/cartao/listagem-cartoes/listagem-cartoes.component';
import { ListagemDespesasComponent } from './components/despesa/listagem-despesas/listagem-despesas.component';
import { AtualizarDespesaComponent } from './components/despesa/atualizar-despesa/atualizar-despesa.component';
import { NovoGanhoComponent } from './components/ganho/novo-ganho/novo-ganho.component';
import { ListagemGanhoComponent } from './components/ganho/listagem-ganho/listagem-ganho.component';
import { AtualizarGanhoComponent } from './components/ganho/atualizar-ganho/atualizar-ganho.component';
import { AtualizarUsuarioComponent } from './components/usuario/atualizar-usuario/atualizar-usuario.component';
import { IndexComponent } from './components/dashboard/index/index.component';

const routes: Routes = [
  {
    path: '', 
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'categoria/listagem', component: ListagemCategoriaComponent
      },
      {
        path: 'categoria/nova', component: NovaCategoriaComponent
      },
      {
        path: 'categoria/atualizarcategoria/:id', component: AtualizarCategoriaComponent
      },
      {
        path: 'funcao/listagem', component: ListagemFuncoesComponent
      },
      {
        path: 'funcao/novafuncao', component: NovaFuncaoComponent
      },
      {
        path: 'funcao/atualizarfuncao/:id', component: AtualizarFuncaoComponent
      },
      {
        path: 'cartao/novo', component: NovoCartaoComponent
      },
      {
        path: 'cartao/listagem', component: ListagemCartoesComponent
      },
      {
        path: 'cartao/atualizar/:id', component: AtualizarCartaoComponent
      },
      {
        path: 'despesa/nova', component: NovaDespesaComponent
      },
      {
        path: 'despesa/listagem', component: ListagemDespesasComponent
      },
      {
        path: 'despesa/atualizar/:id', component: AtualizarDespesaComponent
      },
      {
        path: 'ganho/novo', component: NovoGanhoComponent
      },
      {
        path: 'ganho/listagem', component: ListagemGanhoComponent
      },
      {
        path: 'ganho/atualizar/:id', component: AtualizarGanhoComponent
      },
      {
        path: 'usuario/atualizar', component: AtualizarUsuarioComponent
      },
      {
        path: 'dashboard/index', component: IndexComponent
      },
    ]
  },
  {
    path: 'usuario/registrar', component: RegistrarUsuarioComponent
  },
  {
    path: 'usuario/login', component: LoginUsuarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
