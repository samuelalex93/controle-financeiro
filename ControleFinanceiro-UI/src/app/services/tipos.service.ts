import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Tipo } from '../models/Tipo';

@Injectable({
  providedIn: 'root'
})
export class TiposService {

  url: string = 'API/tipos';

  constructor(
    private http: HttpClient,
  ) { }

  PegarTodos() : Observable<Tipo[]> {
    return this.http.get<Tipo[]>(this.url);
  }
}
