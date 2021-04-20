import { Component } from '@angular/core';
//import { ChartType } from 'chart.js';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public label: string[] = ['Pan', 'Gaseosa', 'Taco'];
  public data: number[] = [100, 200, 400];

  get getLabel(){
    return this.label;
  }
  get getData(){
    return this.data;
  }
  

}
