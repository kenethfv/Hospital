import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuarios.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
                private busquedaService: BusquedasService,
                private modalImagenService: ModalImagenService ) { }

  ngOnInit(): void {

    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe ( delay(100) )
    .subscribe( img => this.cargarUsuarios() );

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios( this.desde )
    .subscribe ( ({ total, usuarios }) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina( valor: number ) {
    this.desde += valor;

    if ( this.desde < 0) {
      this.desde = 0;
    } else if ( this.desde > this.totalUsuarios){
      this.desde -= valor;       
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ) {

    if ( termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.buscar('usuarios', termino)
        .subscribe( (respone: Usuario[]) => {
          this.usuarios = respone;
        })
  }

  eliminarUsuario( usuario: Usuario ) {

    if ( usuario.uid === this.usuarioService.uid ) {
      return Swal.fire('Error', 'No puede Eliminarse a si mismo','warning');
    }

    Swal.fire({
      title: 'Desea Eliminar el Usuario?',
      text: `Esta a punto de Eliminar a ${ usuario.nombre }!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario( usuario )
          .subscribe( resp => {
            this.cargarUsuarios();
            Swal.fire(
            'Eliminado!',
            `${ usuario.nombre } ha sido Eliminado.`,
            'success'
            );
            
          });
      }
    })
  }

  cambiarRole( usuario: Usuario ) {
    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {
        console.log(resp);
      });
  }

  abrirModal( usuario: Usuario ) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img );
  }

}
