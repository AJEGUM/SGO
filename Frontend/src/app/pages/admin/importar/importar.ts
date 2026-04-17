import { Component, inject } from '@angular/core';
import { ImportService } from '../../../services/admin/import';
import { CommonModule } from '@angular/common';
import { CargaMasiva } from "../../../components/admin/carga-masiva/carga-masiva";
import { ListarProgramas } from "../../../components/admin/listar-programas/listar-programas";

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [CargaMasiva, ListarProgramas],
  templateUrl: './importar.html',
  styleUrl: './importar.css',
})
export class Importar {

}
