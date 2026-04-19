import { Component} from '@angular/core';
import { InvitarUsuarios } from '../../../components/admin/invitar-usuarios/invitar-usuarios';
import { ListarUsuarios } from "../../../components/admin/listar-usuarios/listar-usuarios";

@Component({
  selector: 'app-usuarios',
  standalone:true,
  imports: [InvitarUsuarios, ListarUsuarios],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {

}
