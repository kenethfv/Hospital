import { Component, OnDestroy, OnInit } from '@angular/core';

import { Medico } from '../../../models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { MedicoService } from '../../../services/medico.service'
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
                private modalImagenService: ModalImagenService,
                private busquedaService: BusquedasService) { }

  ngOnInit(): void {

    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe ( delay(100) )
    .subscribe( img => this.cargarMedicos() );

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(){ 
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
          this.cargando = false;
          this.medicos = medicos;
        })
  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img );
  }

  buscar( termino: string ) {

    if ( termino.length === 0) {
      return this.cargarMedicos();
    }

    this.busquedaService.buscar('medicos', termino)
        .subscribe( respone => {
          this.medicos = respone;
        });
  }

  eliminarMedico( medico: Medico ) {

    Swal.fire({
      title: 'Desea Eliminar el Usuario?',
      text: `Esta a punto de Eliminar a ${ medico.nombre }!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.medicoService.eliminarMedicos( medico._id )
          .subscribe( resp => {
            this.cargarMedicos();
            Swal.fire(
            'Eliminado!',
            `${ medico.nombre } ha sido Eliminado.`,
            'success'
            );
            
          });
      }
    })
  }

}
