import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-visualizado-final-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizado-final-test.html',
  styleUrl: './visualizado-final-test.css',
})
export class VisualizadoFinalTest {
  @Input() datosTest: any;
}
