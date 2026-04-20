import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionService } from '../../../services/admin/configuracion';
import { LoginService } from '../../../services/public/login-service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {
  // 1. Fuente de verdad única. Las llaves coinciden con CONFIG_KEYS del Back.
  config: any = {
    prompt_sistema_ova: '',
    intentos_test_ova: 3
  };

  cargando: boolean = false;
  guardando: { [key: string]: boolean } = {};
  exito: { [key: string]: boolean } = {};

  constructor(
    private configService: ConfiguracionService, 
    private loginservice: LoginService
  ) {}

  ngOnInit(): void {
    const init = () => this.cargarTodo();
    // Si el usuario ya está cargado en el Signal, dispara; si no, espera al stream
    this.loginservice.currentUser() ? init() : setTimeout(init, 600);
  }

  async cargarTodo() {
    if (this.cargando) return;
    this.cargando = true;
    
    try {
      const claves = Object.keys(this.config);
      const peticiones = claves.map(k => this.configService.obtenerConfiguracion(k));
      const resultados = await Promise.all(peticiones);

      claves.forEach((clave, index) => {
        const valorRecibido = resultados[index].data;
        
        // Lógica de conversión: Si es la clave de intentos, forzamos Number
        if (clave === 'intentos_test_ova') {
          this.config[clave] = Number(valorRecibido) || 3;
        } else {
          this.config[clave] = valorRecibido || '';
        }
      });
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
    } finally {
      this.cargando = false;
    }
  }

  async guardar(clave: string) {
    const valor = this.config[clave];

    // Evitar múltiples clicks o valores nulos
    if (this.guardando[clave]) return;
    if (valor === undefined || valor === null) return;

    this.guardando[clave] = true;
    this.exito[clave] = false;

    try {
      await this.configService.actualizarConfiguracion(clave, valor);
      
      this.exito[clave] = true;
      // El mensaje dura 3 segundos
      setTimeout(() => this.exito[clave] = false, 3000);
    } catch (error) {
      console.error(`Error al guardar ${clave}:`, error);
      // Aquí podrías disparar un toast de error si tienes uno
    } finally {
      this.guardando[clave] = false;
    }
  }
}