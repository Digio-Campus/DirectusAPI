import { Component, Input } from '@angular/core';
import { DirectusService } from '../directus.service';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-manage-items',
  standalone: true,
  imports: [FormsModule, FormsModule],
  templateUrl: './manage-items.component.html',
})
export class ManageItemsComponent {

  prueba: any;

  @Input() collection: any;
  camposValores: any = {};

  public respuesta: boolean = false;
  private mensajeError = "";


  constructor(private directusService: DirectusService) {
    console.log("pruebaaaaaaaba: " + this.prueba)
  }

  createItem() {

    let newObject = this.camposValores;

    this.camposValores.logo = this.getFileID();

    this.directusService.createItem(this.collection, newObject).
      subscribe((response: any) => {
        console.log('Item creado con éxito:', response);
        this.respuesta = true;
        this.mensajeError = "Item creado con éxito";

      },
        (error: any) => {
          console.error('Error al crear el item:', error);

          this.mensajeError = "Error al crear el item: " + error.data;
        }
      );


    console.log("FUERA DE EL SUBSCRIBE");
    this.respuesta = false;

  }


  handleFileInput(event: any): void {

    // 1. Obtiene el elemento que generó el evento y lo castea a un HTMLInputElement
    const inputElement = event.target as HTMLInputElement;

    // 2. Obtiene los archivos que se seleccionaron
    const files = inputElement.files;

    // 3. Si hay archivos y al menos uno, toma el primer archivo y lo sube al servidor
    if (files && files.length > 0) {
      const fileToUpload = files[0];
      this.directusService.uploadFile(fileToUpload);
    } else {
      console.error('No se seleccionó ningún archivo.');
    }
  }

  // handleFileInput(event: any): void {

  //   //Genera comentarios explicando cada linea de codigo de esta función:

  //   // 1. Obtiene el elemento que generó el evento y lo castea a un HTMLInputElement
  //   const inputElement = event.target as HTMLInputElement;

  //   // 2. Obtiene los archivos que se seleccionaron
  //   const files = inputElement.files;

  //   // 3. Si hay archivos y al menos uno, toma el primer archivo y lo sube al servidor
  //   if (files && files.length > 0) {
  //     const fileToUpload = files[0];
  //     this.directusService.uploadFile(fileToUpload).subscribe((response:any) => {
  //             console.log('Archivo subido con éxito:', response);
  //           }, error => {
  //             console.error('Error al subir el archivo:', error);
  //           });



  //   } else {
  //     console.error('No se seleccionó ningún archivo.');
  //   }
  // }

  getFields() {

    // Obtenemos todos los campos de la collection
    let items = this.getCollectionItems();

    // Verificamos que items no sea null o undefined y que tenga al menos un elemento
    if (items && items.length > 0) {
      // Tomamos el primer objeto del array
      let objeto = items[0];

      // Verificamos que objeto no sea null o undefined
      if (objeto) {

        // Obtenemos las claves del objeto, que representan los nombres de los campos
        let campos = Object.keys(objeto);

        // Eliminamos los campos que no nos interesan
        campos = campos.filter(e => e != "id" && e != "date_created" && e != "date_updated" && e != "created_by" && e != "updated_by");
        return campos;
      }
    }
    // Si no hay items o el primer item no es un objeto, devolvemos un array vacío
    return [];
  }

  getCollection() {
    return this.collection;
  }
  getCollectionItems() {
    return this.directusService.getCollectionItems();
  }

  getFileID() {
    return this.directusService.getFileID();
  }

  getMensajeError() {
    return this.mensajeError;
  }

  getPrueba() {
    this.prueba = "prueba";
    console.log("VALOR DE PRUEBA: " + this.prueba);
    console.log("VALOR DE RESPUESTA " + this.respuesta);
    this.respuesta = false;
  }

  openModal() {
    const modalDiv = document.getElementById('myModal');

    if (modalDiv) {
      modalDiv.style.display = "block";
    }
  }

  closeModal() {
    const modalDiv = document.getElementById('test');
    const modalDiv2 = document.getElementById('createObject');
    modalDiv2?.remove();

    modalDiv?.classList.remove();
    modalDiv2?.classList.remove();

    // if (modalDiv) {
    //   modalDiv.style.display = "none";
    // }
  }

  cerrarModal() {
    const modal = document.querySelector('.modal');
    // modal.style.display = 'none';
  }

}
