import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para standalone
import { LoginService } from '../../../services/public/login-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  mostrarInvitacion = false;
  errorLogin: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: LoginService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['invitation'] === 'true') {
        this.mostrarInvitacion = true;
      }

      if (params['error']) {
        this.errorLogin = params['error'];
        this.mostrarInvitacion = false;
      }
    });
  }

  loginConGoogle(): void {
    this.authService.loginWithGoogle();
  }
}