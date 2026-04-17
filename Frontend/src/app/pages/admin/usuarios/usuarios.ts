import { Component} from '@angular/core';
import { InvitarUsuarios } from '../../../components/admin/invitar-usuarios/invitar-usuarios';

@Component({
  selector: 'app-usuarios',
  standalone:true,
  imports: [InvitarUsuarios],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {

}
