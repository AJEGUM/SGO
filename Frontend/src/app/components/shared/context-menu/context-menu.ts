import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ContextMenuOption {
  id: string;
  label: string;
  icon: string;
  class?: string;
}

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.html',
  styles: [`
    .animate-context-menu {
      animation: fadeInZoom 0.1s ease-out;
    }
    @keyframes fadeInZoom {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ContextMenuComponent {
  @Input() x = 0;
  @Input() y = 0;
  @Input() isOpen = false;
  @Input() title = 'Opciones';
  @Input() options: ContextMenuOption[] = [];

  @Output() optionSelected = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  // Cierra el menú si haces clic izquierdo en cualquier parte
  @HostListener('document:click')
  clickOutside() {
    if (this.isOpen) this.closed.emit();
  }

  // Evita que el clic derecho dentro del menú abra el menú del navegador
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  onSelect(optionId: string) {
    this.optionSelected.emit(optionId);
    this.closed.emit();
  }
}