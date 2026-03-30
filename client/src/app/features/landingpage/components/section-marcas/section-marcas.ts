import { Component, input } from '@angular/core';
import ISectionMarca from './model/isection-marca';

@Component({
  selector: 'app-section-marcas',
  imports: [],
  templateUrl: './section-marcas.html',
  styleUrl: './section-marcas.css',
})
export class SectionMarcas {
  public dataColaboration = input.required<ISectionMarca>();

}
