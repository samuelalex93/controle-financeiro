import { Categoria } from '../models/Categoria';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders ({ 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('TokenUsuarioLogado')}`
  })
};

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  url: string = 'API/categorias';

  constructor(
    private http: HttpClient,
  ) { }

  PegarTodos() : Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }

  PegarCateregoriaPeloId(categoriaId: number) : Observable<Categoria> {
    return this.http.get<Categoria>(`${this.url}/${categoriaId}`);
  }

  FiltrarCategorias(nomeCategoria: string) : Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.url}/FiltrarCategorias/${nomeCategoria}`);
  }

  NovaCategoria(categoria: Categoria): Observable<any> {
    return this.http.post<Categoria>(this.url, categoria, httpOptions);
  }

  AtualizarCategoria(categoriaId: number, categoria: Categoria): Observable<any> {
    return this.http.put<Categoria>(`${this.url}/${categoriaId}`, categoria, httpOptions);
  }

  ExcluirCategoria(categoriaId: number): Observable<any> {
    return this.http.delete<number>(`${this.url}/${categoriaId}`, httpOptions);
  }

  FiltrarCategoriasDespesas(): Observable<Categoria[]>{
    const apiUrl = `${this.url}/FiltrarCategoriasDespesas`;
    return this.http.get<Categoria[]>(apiUrl);
  }

  FiltrarCategoriasGanhos(): Observable<Categoria[]>{
    const apiUrl = `${this.url}/FiltrarCategoriasGanhos`;
    return this.http.get<Categoria[]>(apiUrl);
  }
}
