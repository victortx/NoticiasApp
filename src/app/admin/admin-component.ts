import { Component } from '@angular/core';
import {AuthService} from '../services/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-component',
  standalone: false,
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.scss'
})
export class AdminComponent {
  userName: string | undefined = "";

  constructor(public authService: AuthService, private router: Router) {
    this.userName = this.authService.user?.nombre || this.authService.user?.username;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

}
