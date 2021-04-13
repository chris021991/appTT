import { Observable } from 'rxjs';


// Clase no usada por el momento, prueba para subir imagenes como objetos
export class Image {
  public name: string;
  public uploading = false;
  public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;

  constructor(public file: File = file) {
    this.name = file.name;
  }
}
