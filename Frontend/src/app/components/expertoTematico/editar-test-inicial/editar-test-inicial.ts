import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-test',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-test-inicial.html'
})
export class EditarTestComponent implements OnInit {
  @Input() test: any = null; // Recibe el objeto testActual del padre
  @Output() alGuardar = new EventEmitter<any>(); // Emite los datos modificados hacia la DB
  @Output() alCerrar = new EventEmitter<void>(); // Avisa al padre que debe cerrar el modal

  testForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.test) {
      this.initForm();
    }
  }

  /**
   * Inicializa el FormGroup principal y precarga la data del JSON de la IA
   */
  initForm(): void {
    this.testForm = this.fb.group({
      nombre_test: [this.test.nombre_test || '', Validators.required],
      descripcion: [this.test.descripcion || ''],
      preguntas: this.fb.array([]) // Array dinámico de preguntas
    });

    // Hidratamos el FormArray con las preguntas y opciones reales de la DB
    if (this.test.preguntas && Array.isArray(this.test.preguntas)) {
      this.test.preguntas.forEach((pregunta: any) => {
        this.preguntasFormArray.push(this.crearPreguntaGroup(pregunta));
      });
    }
  }

  // Getters para facilitar el acceso desde el HTML sin saturar las directivas
  get preguntasFormArray(): FormArray {
    return this.testForm.get('preguntas') as FormArray;
  }

  getOpcionesFormArray(preguntaIndex: number): FormArray {
    return this.preguntasFormArray.at(preguntaIndex).get('opciones') as FormArray;
  }

  /**
   * Crea un sub-grupo para una pregunta individual
   */
  private crearPreguntaGroup(pregunta: any): FormGroup {
    const grupoPregunta = this.fb.group({
      enunciado: [pregunta.enunciado || '', Validators.required],
      opciones: this.fb.array([]) // Array dinámico de opciones internas
    });

    const opcionesArray = grupoPregunta.get('opciones') as FormArray;
    if (pregunta.opciones && Array.isArray(pregunta.opciones)) {
      pregunta.opciones.forEach((opcion: any) => {
        opcionesArray.push(this.fb.group({
          texto: [opcion.texto || opcion, Validators.required],
          es_correcta: [opcion.es_correcta === true]
        }));
      });
    }

    return grupoPregunta;
  }

  /**
   * Cambia la opción seleccionada a correcta y apaga el resto de la misma pregunta
   */
  seleccionarOpcionCorrecta(preguntaIndex: number, opcionIndex: number): void {
    const opciones = this.getOpcionesFormArray(preguntaIndex);
    opciones.controls.forEach((control, idx) => {
      control.get('es_correcta')?.setValue(idx === opcionIndex);
    });
  }

  /**
   * Procesa el formulario y emite la estructura lista para ser consumida por el backend
   */
  enviarCambios(): void {
    if (this.testForm.valid) {
      this.alGuardar.emit(this.testForm.value);
    } else {
      // Marcamos los campos para alertar visualmente errores si el formulario está incompleto
      this.testForm.markAllAsTouched();
    }
  }
}