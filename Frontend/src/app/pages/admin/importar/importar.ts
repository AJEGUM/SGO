import { Component, inject } from '@angular/core';
import { ImportService } from '../../../services/admin/import';
import { CommonModule } from '@angular/common';
import { CargaMasiva } from "../../../components/admin/carga-masiva/carga-masiva";

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [CargaMasiva],
  templateUrl: './importar.html',
  styleUrl: './importar.css',
})
export class Importar {

}
