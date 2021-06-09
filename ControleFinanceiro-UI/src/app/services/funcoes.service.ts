import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcao } from '../models/Funcao';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('TokenUsuarioLogado')}`
  }),
};

@Injectable({
  providedIn: 'root'
})
export class FuncoesService {
  url: string = 'API/Funcoes';

  constructor(private http: HttpClient) { }

  PegarTodos(): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(this.url);
  }

  PegarPeloId(funcaoId: string): Observable<Funcao> {
    return this.http.get<Funcao>(`${this.url}/${funcaoId}`);
  }

  FiltrarFuncao(nomeFuncao: string) : Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.url}/FiltrarFuncoes/${nomeFuncao}`);
  }

  NovaFuncao(funcao: Funcao): Observable<any> {
    return this.http.post<Funcao>(this.url, funcao, httpOptions);
  }

  AtualizarFuncao(funcaoId: string, funcao: Funcao): Observable<any> {
    return this.http.put<Funcao>(`${this.url}/${funcaoId}`, funcao, httpOptions);
  }

  ExcluirFuncao(funcaoId: string): Observable<any> {
    return this.http.delete<Funcao>(`${this.url}/${funcaoId}`, httpOptions);
  }
}
