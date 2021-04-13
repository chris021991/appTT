import { Image } from '../models/image.interface';


export class ImageValidator {
    private acceptType = ['image/jpeg', 'image/png'];

    validateType(fileType: string): boolean {
      return fileType === '' || fileType === undefined
        ? false
        : this.acceptType.includes(fileType);
    }

    checkDropped(fileName: string, files: Image[]): boolean {
      for (const file of files) {
        if (file.name === fileName) {
          return true;
        }
      }
      return false;
    }
  }
