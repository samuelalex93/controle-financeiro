import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { JwtModule } from '@auth0/angular-jwt';

import { NgxMaskModule } from 'ngx-mask';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';

import { ChartsModule } from 'ng2-charts';

import { ListagemCategoriaComponent, DialogExclusaoCategoriasComponent } from './components/categoria/listagem-categoria/listagem-categoria.component';
import { NovaCategoriaComponent } from './components/categoria/nova-categoria/nova-categoria.component';
import { AtualizarCategoriaComponent } from './components/categoria/atualizar-categoria/atualizar-categoria.component';
import { DialogExclusaoFuncoesComponent, ListagemFuncoesComponent } from './components/funcao/listagem-funcoes/listagem-funcoes.component';
import { NovaFuncaoComponent } from './components/funcao/nova-funcao/nova-funcao.component';
import { AtualizarFuncaoComponent } from './components/funcao/atualizar-funcao/atualizar-funcao.component';
import { RegistrarUsuarioComponent } from './components/usuario/registro/registrar-usuario/registrar-usuario.component';
import { LoginUsuarioComponent } from './components/usuario/login/login-usuario/login-usuario.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { HeaderComponent } from './components/dashboard/header/header.component';
import { NovoCartaoComponent } from './components/cartao/novo-cartao/novo-cartao.component';
import { AtualizarCartaoComponent } from './components/cartao/atualizar-cartao/atualizar-cartao.component';
import { ListagemCartoesComponent, DialogExclusaoCartoesComponent } from './components/cartao/listagem-cartoes/listagem-cartoes.component';
import { NovaDespesaComponent } from './components/despesa/nova-despesa/nova-despesa.component';
import { DialogExclusaoDespesasComponent, ListagemDespesasComponent } from './components/despesa/listagem-despesas/listagem-despesas.component';
import { AtualizarDespesaComponent } from './components/despesa/atualizar-despesa/atualizar-despesa.component';
import { NovoGanhoComponent } from './components/ganho/novo-ganho/novo-ganho.component';
import { DialogExclusaoGanhosComponent, ListagemGanhoComponent } from './components/ganho/listagem-ganho/listagem-ganho.component';
import { AtualizarGanhoComponent } from './components/ganho/atualizar-ganho/atualizar-ganho.component';
import { AtualizarUsuarioComponent } from './components/usuario/atualizar-usuario/atualizar-usuario.component';
import { IndexComponent } from './components/dashboard/index/index.component';

export function PegarTokenUsuario() {
  return localStorage.getItem("TokenUsuarioLogado");
}
@NgModule({
  declarations: [
    AppComponent,
    ListagemCategoriaComponent,
    NovaCategoriaComponent,
    AtualizarCategoriaComponent,
    DialogExclusaoCategoriasComponent,
    ListagemFuncoesComponent,
    NovaFuncaoComponent,
    AtualizarFuncaoComponent,
    DialogExclusaoFuncoesComponent,
    RegistrarUsuarioComponent,
    LoginUsuarioComponent,
    DashboardComponent,
    HeaderComponent,
    NovoCartaoComponent,
    AtualizarCartaoComponent,
    ListagemCartoesComponent,
    DialogExclusaoCartoesComponent,
    NovaDespesaComponent,
    ListagemDespesasComponent,
    DialogExclusaoDespesasComponent,
    AtualizarDespesaComponent,
    NovoGanhoComponent,
    ListagemGanhoComponent,
    DialogExclusaoGanhosComponent,
    AtualizarGanhoComponent,
    AtualizarUsuarioComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSelectModule,
    MatGridListModule,
    MatDialogModule,
    FormsModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    FlexLayoutModule,
    ChartsModule,
    NgxMaskModule.forRoot(),
    JwtModule.forRoot({
     config: {
       tokenGetter: PegarTokenUsuario,
       allowedDomains: ['localhost:5000','localhost:5001'],
       disallowedRoutes: []
     } 
    }),
  ],
  providers: [
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
