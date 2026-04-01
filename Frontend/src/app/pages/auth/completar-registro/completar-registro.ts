import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth';

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
    // 1. Capturar el token de la URL (?token=xxxx)
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. Validar el token contra el Backend para pintar la UI
    this.authService.verificarInvitacion(token).subscribe({
      next: (res) => {
        // Asignamos la data (rol, programas, correo) que viene del backend
        this.datosInvitacion = res.data;
        this.registroForm.patchValue({ token: token });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Token inválido:', err);
        this.router.navigate(['/login']);
      }
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
}