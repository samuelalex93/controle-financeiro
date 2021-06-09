import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isAdministrador: boolean = false;

  constructor(
    private authGuard: AuthGuardService
  ) { }

  ngOnInit(): void {
    this.isAdministrador = this.authGuard.verificarAdmistrador();
  }

}
