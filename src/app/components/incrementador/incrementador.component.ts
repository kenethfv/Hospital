import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';


@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit{

  ngOnInit(){
    this.btnClass = `btn ${ this.btnClass }`;
  }

  // Anotacion para que un valor entre en este caso debe entrar con el nombre de 'valor'
  /* @Input() progreso: number = 40; */
  @Input('valor') progreso: number = 10;
  @Input() btnClass: string = 'btn-info';


  // Anotacion de que una variable va a salir, en este caso sera 'valorSalida'
  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();


  cambiarValor( valor: number){
    if (this.progreso >= 100 && valor >= 0 ){
      this.valorSalida.emit(100);
      return this.progreso = 100;
    }

    if (this.progreso <= 0 && valor < 0 ){
      this.valorSalida.emit(0);
      return this.progreso = 0;
    }
    this.progreso = this.progreso + valor;
    this.valorSalida.emit(this.progreso);
    return this.progreso;
  }

  onChange( nuevoValor: number ){
    if( nuevoValor >= 100 ){
      this.progreso = 100;
    } else if( nuevoValor <= 0 ){
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }
    this.valorSalida.emit( this.progreso );
  }

}
