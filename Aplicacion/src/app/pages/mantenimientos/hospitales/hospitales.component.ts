import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from '../../../models/hospital.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { HospitalService } from '../../../services/hospital.service'

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
                private modalImagenService: ModalImagenService,
                private busquedaService: BusquedasService ) { }

  ngOnInit(): void {

    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe ( delay(100) )
    .subscribe( img => this.cargarHospitales() );

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;

     this.hospitalService.cargarHospitales()
     .subscribe( hospitales => {
       this.cargando = false;
       this.hospitales = hospitales;
     });
  }

  guardarCambios( hospital: Hospital ){
    this.hospitalService.actualizarHospitales( hospital._id, hospital.nombre )
    .subscribe( resp => {
      Swal.fire('Actualizado!', `${ hospital.nombre }`, 'success' );
    })
  }

  eliminarHospital( hospital: Hospital ){
    this.hospitalService.eliminarHospitales( hospital._id )
    .subscribe( resp => {
      this.cargarHospitales();
      Swal.fire('Eliminado!', `${ hospital.nombre }`, 'success' );
    })
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Nuevo Hospital',
      text: 'Ingrese Nombre del nuevo Hospital',
      input: 'text',
      showCancelButton: true,
      inputPlaceholder: 'Nombre de Hospital'
    })

    if ( value.length > 0 ) {
      this.hospitalService.crearHospitales( value )
          .subscribe( (resp : any) => {
            Swal.fire('Creado!', `${ value } creado Correctamente!`, 'success' );
            this.hospitales.push( resp.hospital );
          })
    }
  }

  abrirModal( hospital: Hospital ) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img );
  }

  buscar( termino: string ) {

    if ( termino.length === 0) {
      return this.cargarHospitales();
    }

    this.busquedaService.buscar('hospitales', termino)
        .subscribe( respone => {
          this.hospitales = respone;
        });
  }

}
