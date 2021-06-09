import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  token: any = localStorage.getItem('TokenUsuarioLogado');

  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if(this.token && !this.jwtHelper.isTokenExpired(this.token)) {
      return true;
    }

    this.router.navigate(['/usuario/login']);
    return false;
  }

  verificarAdmistrador(): boolean {
    const tokenUsuario: any = decode(this.token);

    if(tokenUsuario.role == 'Administrador') {
      return true;
    }

    return false;
  }
}
