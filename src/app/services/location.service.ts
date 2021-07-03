import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  cities = [
    [
      'Guayaquil',
      'Quito',
      'Cuenca',
      'Santo Domingo',
      'Machala',
      'Durán',
      'Manta',
      'Portoviejo',
      'Ambato',
      'Riobamba',
      'Quevedo',
      'Loja',
      'Ibarra',
      'Milagro',
      'Esmeraldas',
      'La Libertad',
      'Babahoyo',
      'Tulcán',
      'Sangolquí',
      'Latacunga',
      'Pasaje',
      'Chone',
      'Santa Rosa',
      'Huaquillas',
      'Nueva Loja',
      'El Carmen',
      'Jipijapa',
      'Ventanas',
      'Daule',
      'Cayambe',
      'Otavalo',
      'Velasco Ibarra',
      'Azogues',
      'Santa Elena',
      'Salinas',
      'La Troncal',
      'Buena Fe'
    ]
  ];

  constructor() { }
}
