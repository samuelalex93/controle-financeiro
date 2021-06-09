import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ganho } from '../models/Ganhos';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/json',
    'Authorization' : `Bearer ${localStorage.getItem('TokenUsuarioLogado')}`
  })
};


@Injectable({
  providedIn: 'root'
})
export class GanhosService {

url = 'API/Ganhos';

  constructor(private http: HttpClient) { }

  PegarGanhosPeloUsuarioId(usuarioId: string): Observable<Ganho[]>{
    const apiUrl = `${this.url}/PegarGanhosPeloUsuarioId/${usuarioId}`;
    return this.http.get<Ganho[]>(apiUrl);
  }

  PegarGanhoPeloId(ganhoId: number) : Observable<Ganho>{
    const apiUrl = `${this.url}/${ganhoId}`;
    return this.http.get<Ganho>(apiUrl);
  }

  NovoGanho(ganho: Ganho) : Observable<any>{
    return this.http.post<Ganho>(this.url, ganho, httpOptions);
  }

  AtualizarGanho(ganhoId: number, ganho: Ganho) : Observable<any>{
    const apiUrl = `${this.url}/${ganhoId}`;
    return this.http.put<Ganho>(apiUrl, ganho, httpOptions);
  }

  ExcluirGanho(ganhoId: number) : Observable<any>{
    const apiUrl = `${this.url}/${ganhoId}`;
    return this.http.delete<number>(apiUrl, httpOptions);
  }

  FiltrarGanhos(nomeCategoria: string): Observable<Ganho[]>{
    console.log(nomeCategoria);
    const apiUrl = `${this.url}/FiltrarGanhos/${nomeCategoria}`;
    return this.http.get<Ganho[]>(apiUrl);
  }
}