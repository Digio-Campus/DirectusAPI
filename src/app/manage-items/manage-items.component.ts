import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DirectusService } from '../directus.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-items',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-items.component.html',

})
export class ManageItemsComponent {

  value: string = '';

  @Input() collection: any;
  @Output() respuesta = new EventEmitter<string>();

  @ViewChild('contenedor') contenedor!: ElementRef;
  camposValores: any = {};
  subjects: any = {};
  students: any = {};

  // @Input() respuesta:any = false;
  private mensajeError = "";


  constructor(private directusService: DirectusService) {

    console.log("ESTO ES UNA PRUEBA  " + this.directusService.getSpecialFields())
  }

  ngOnInit() {
    // this.directusService.fetchFields(this.collection);

  }

  // Metodo para crear un objeto de una entidad
  createItem() {

    // Creamos un nuevo objeto que contendra los campos y valores rellenados del formulario
    let newObject = this.camposValores;

    // Si hay logo, lo añadimos al objeto
    this.camposValores.logo = this.getFileID();

    // Solicitud post para añadir el objeto a la entidad
    this.directusService.createItem(this.collection, newObject).
      subscribe((response1: any) => {

        console.log('Item creado con éxito:', response1);

        this.respuesta.emit("1");
        this.mensajeError = "Item creado con éxito";

        // Guardamos el nuevo objeto actualizado en la lista de objetos de la entidad
        this.directusService.getCollectionItems().push(response1.data);

        // Recorremos los campos especiales de la entidad
        this.directusService.getSpecialFields().forEach(e => {


          // Si el campo es de tipo m2m deberemos de añadir tambien un objeto en la tabla intermedia
          if (e.special == 'm2m') {

            let field = this.capitalize(e.field);

            let m2mField = e.field;

            if (field == "Students" || field == "Teachers") {

              Object.keys(this.students).forEach((e: any) => { 
                // Creamos un nuevo objeto cuyas keys seran el id de la entidad y el id del campo m2m 
                let obj = {
                  [this.collection + "_id"]: response1.data.id,
                  ["directus_users_id"]: e
                }
                this.directusService.createItem(this.collection + "_" + "directus_users", obj).subscribe((response: any) => {
  
                  this.directusService.getCollectionItems().forEach(e => {
  
                    if (e.id == response.data[this.collection + "_id"]) {
                      e[m2mField] = [...e[m2mField], response.data.id];
                      this.respuesta.emit("1");
                    }
                  });
                  this.respuesta.emit("1");
                  // this.mensajeError = "Item creado con éxito";
  
  
                },
                  (error: any) => {
                    // console.error('Error al crear el item:', error);
                    this.respuesta.emit("2");
                    // this.mensajeError = "Error al crear el item: " + error.data;
                  }
                );

              });
            }
            else {
              Object.keys(this.subjects).forEach((e: any) => {

                console.log("ESTO ES UNA PRUEBAAAAAA: " + field)

                // Creamos un nuevo objeto cuyas keys seran el id de la entidad y el id del campo m2m 
                let obj = {
                  [this.collection + "_id"]: response1.data.id,
                  [field + "_id"]: e
                }
                this.directusService.createItem(this.collection + "_" + field, obj).subscribe((response: any) => {

                  this.directusService.getCollectionItems().forEach(e => {

                    if (e.id == response.data[this.collection + "_id"]) {
                      e[m2mField] = [...e[m2mField], response.data.id];
                      this.respuesta.emit("1");
                    }
                  });
                  this.respuesta.emit("1");
                  // this.mensajeError = "Item creado con éxito";


                },
                  (error: any) => {
                    // console.error('Error al crear el item:', error);
                    this.respuesta.emit("2");
                    // this.mensajeError = "Error al crear el item: " + error.data;
                  }
                );




              });
            }


          }
        });
      },
        (error: any) => {
          console.error('Error al crear el item:', error);
          this.respuesta.emit("2");
          this.mensajeError = "Error al crear el item: " + error.data;
        }
      );
  }

  // Metodo para manejar la subida de archivos
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


  // Metodo para obtener los campos a rellenar de una colección
  getFields() {

    let fields = this.directusService.getFields();

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
        fields = fields.filter(e => e.field != "id" && e.field != "date_created" && e.field != "date_updated" && e.field != "created_by" && e.field != "updated_by");

        // console.log("CAMPOS TEST: " + JSON.stringify(campos))

        // campos.forEach(e => {
        //   console.log("CAMPOS: " + e)
        // });

        // console.log("FIELDS: " + JSON.stringify(fields));

        let obj = {
          field: "",
          collection: "",
          meta: {
            special: ""
          }
        };


        // if (!this.fetchedItems) { 
        fields.forEach(e => {
          // console.log("F I E L D S: " + e.collection)

          if (e.meta.special) {
            // console.log("ESPECIAL: " + e.meta.special + " " + e.field)


            // this.directusService.fetchCollectionItems(e.collection);
            // this.fetchedItems = true;
            let items = this.directusService.getCollectionItems();
            return;
          }
          else {
            // console.log("NO ESPECIAL: " + e.meta.special)
          }
        });

        // }

        // console.log("ITEMSSSS: " + items)
        return fields;
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

  getSpecialFields() {
    return this.directusService.getSpecialFields();
  }

  getFileID() {
    return this.directusService.getFileID();
  }

  getMensajeError() {
    return this.mensajeError;
  }


  capitalize(cadena: string) {
    let str = cadena;

    if (str) {
      str = str.charAt(0).toUpperCase() + str.slice(1);
      return str;
    } else {
      return '';
    }
  }

  // writeValue(value: string): void {
  //   this.value = value;
  // }

  // registerOnChange(fn: any): void {
  //   this.onChange = fn;
  // }

  // registerOnTouched(fn: any): void {
  //   this.onTouched = fn;
  // }

}
