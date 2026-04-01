import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-completar-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './completar-registro.html',
  styleUrl: './completar-registro.css'
})
export class CompletarRegistro implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // --- Estado de la UI ---
  verModal: boolean = false; // Controla la visibilidad del modal de programas
  cargando: boolean = true;  // Pantalla de carga inicial
  enviando: boolean = false; // Estado del botón de registro
  mensajeError: string | null = null;
  
  // --- Datos y Formulario ---
  datosInvitacion: any = null;
  registroForm: FormGroup;

  constructor() {
    // Inicialización limpia del formulario
    this.registroForm = this.fb.group({
      nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmar_password: ['', Validators.required],
      token: ['']
    }, { validators: this.passwordMatchValidator });
  }

ngOnInit(): void {
  const token = this.route.snapshot.queryParams['token'];
  if (!token) { this.router.navigate(['/login']); return; }

  this.authService.verificarInvitacion(token).subscribe({
    next: (res) => {
      this.datosInvitacion = res.data;
      this.registroForm.patchValue({ token: token });
      this.cargando = false;
      
      // Inicializar el botón de Google después de que cargue la UI
      setTimeout(() => this.inicializarGoogleButton(), 100);
    },
    error: () => this.router.navigate(['/login'])
  });
}

  // --- Lógica del Modal ---
  toggleModal(): void {
    this.verModal = !this.verModal;
  }

  // --- Validador de contraseñas ---
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirm = g.get('confirmar_password')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // Dejamos el onSubmit listo pero sin lógica de registro pesada por ahora
  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
    console.log('Formulario listo para registro:', this.registroForm.value);
  }

inicializarGoogleButton() {
  // @ts-ignore
  google.accounts.id.initialize({
    client_id: environment.googleClientId,
    callback: this.onGoogleLoginSuccess.bind(this)
  });

  // @ts-ignore
  google.accounts.id.renderButton(
    document.getElementById("googleBtn"),
    { 
      theme: "outline", 
      size: "large", 
      width: "100%", 
      text: "continue_with", 
      shape: "pill" 
    }
  );
}

onGoogleLoginSuccess(response: any) {
  this.enviando = true;
  this.mensajeError = null;
  const tokenGoogle = response.credential;
  const tokenInvitacion = this.route.snapshot.queryParams['token']; // Asegúrate que sea queryParams

  this.authService.completarRegistroGoogle(tokenGoogle, tokenInvitacion).subscribe({
    next: (res) => {
      this.enviando = false;
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.enviando = false;
      // Capturamos el 403 de "Correo X no es Correo Y"
      this.mensajeError = err.error.msg || 'Error en la autenticación';
    }
  });
}
}