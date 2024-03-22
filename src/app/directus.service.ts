import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone, ɵSSR_CONTENT_INTEGRITY_MARKER } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { LanguagesService } from './languages.service';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root'
})
export class DirectusService {

  private data: any[] = []
  private collections: any[] = [];
  private collectionItems: any[] = []
  private fields: any[] = [];
  private base = "http://localhost:8055/";
  private urlBase = "http://localhost:8055/items/"
  private urlFields = "http://localhost:8055/"
  private urlCollections = "http://localhost:8055/collections"
  // Course?access_token=N9dMkfzgZmSYt81ZfJnwRibPvUm0IOW-

  private fileID: any;

  private translations: any[] = [];
  private test: any;
  private userData: any[] = [];
  private allFields: any[] = [];
  private variablePrueba: any[] = [];
  private allCollectionItems: any[] = [];

  private specialFields: any[] = [];

  private collectionFields: any[] = [];

  constructor(private httpClient: HttpClient, private ngZone: NgZone, private loginService: LoginService, private languageService: LanguagesService) {

    this.data = JSON.parse(localStorage.getItem("data") || '[]');
    // this.collections = JSON.parse(localStorage.getItem("collections") || '[]');
    // this.collectionItems = JSON.parse(localStorage.getItem("collectionItems") || '[]');
    this.fields = JSON.parse(localStorage.getItem("fields") || '[]');


    //TODO: CAMPOS
    this.fields.forEach((e: any) => {
      if (e.meta.translations != null) {

        let campos = {
          collection: e.collection,
          id: e.meta.id,
          field: e.meta.field,
          translation: e.meta.translations[0].translation
        }

        this.collectionFields.push(campos);
        // console.log("entidad: " + e.collection + "translations: " + e.meta.translations[0].translation);

      }
    });

  }

  fetchCollections() {
    this.httpClient.get(this.urlCollections)
      .subscribe({
        next: ((response: any) => {
          this.collections = response.data;

          // Guardamos la colección en el sessionStorage
          // sessionStorage.setItem("collections", JSON.stringify(response.data))
        }),
        error: (error => {
          console.error(error);
        })
      });
  }

  // getColls(): Observable<any> {
  //   return this.httpClient.get(this.urlCollections).pipe(res=>res);
  // }
  // getCollItems(collection: string): Observable<any> {
  //   return this.httpClient.get(this.urlBase + collection).pipe(res=>res);
  // }

  fetchFields(collection: string) {

    this.specialFields = [];

    // Nos suscribimos a todos los campos de la coleccion.
    this.httpClient.get(this.urlFields + "fields/" + collection)
      .subscribe((response: any) => {

        //Guardamos la respuesta en nuestra variable fields.
        this.fields = response.data;
        const translationsArray: any = [];

        
        response.data.forEach((e: any) => {
        //   if (e.meta.translations != null) {
        //     // console.log("Entidad: " + e.collection + " traducciones " + e.meta.translations[0].translation)
        //     translationsArray.push(e.meta.translations);
        //     localStorage.setItem("fields", JSON.stringify(response.data))


        // Comprobamos si los campos tienen otros campos relacionados..
        if (e.meta.special && e.meta.special != 'uuid' && e.meta.special != 'date-created' && e.meta.special != 'date-updated' && e.meta.special != 'file' && e.meta.field != 'students') {
          // console.log("ESPECIAL DESDE FETCHFIELDS: " + JSON.stringify(e.meta.special))

          // TODO: Faltaria controlar el campo students, debemos de traer directus_users

          // Si los campos tienen otros campos relacionados deberemos de obtener los nombres de dichas colecciones:

          let msg = e.meta.field;
          msg = msg.charAt(0).toUpperCase() + msg.slice(1);
          console.log("MSG: " + msg)


          this.httpClient.get(this.urlBase + msg)
          .subscribe({
            next: ((response: any) => {
              // this.collectionItems = response.data;
              // console.log("PRUEBA DE SEGUNDO FETCH:    " + JSON.stringify(response.data))

              console.log("ESPECIALLLLLLLLL ------------> " + JSON.stringify(e.meta.field))

              // Creamos un objeto que contendra el nombre de la collecion y sus objetos.
              let newObj = {
                collection: msg,
                special: e.meta.special,
                items: response.data,
                field: e.meta.field
              }
              this.specialFields.push(newObj)

              console.log("-----------------------------------------")
    
            }),
            error: (error => {
              console.error("ERROR: " + error);
            })
    
          });





        }



        //     // Si dispone de un campo especial, debemos de conseguir los objetos de esa coleccion.
        //     if (e.meta.special) {

        //       if (e.meta.special && !e.meta.special.includes('date_created') && !e.meta.special.includes('date_updated') && e.meta.special && !e.meta.special.includes('date_created') && !e.meta.special.includes('date_updated')) {

        //         console.log("wefwefwefwef " + e.meta.field)
        //         this.specialFields.push(e.meta.field)
                
              

        //       this.httpClient.get(this.urlBase + e.meta.field)
        //         .subscribe({
        //           next: ((response: any) => {

        //             console.log("CUAL ES LA COLECCION?    " + e.meta.field)
        //             this.specialFields.push(JSON.stringify(response.data))

        //           }),
        //           error: (error => {
        //             console.error("ERROR: " + error);
        //             console.log("ERROR CAPTURADO!")
        //           })

        //         });

        //       // let objColeccion = {}
        //       // this.specialFields.push(e.field);

        //       // console.log("ESPECIAL DESDE FETCHFIELDS: " + JSON.stringify(this.specialFields))
        //     }


        //   }
        // }

        });

      })

    // return this.fields;
  }

  fetchCollectionItems(collection: string) {
    this.httpClient.get(this.urlBase + collection)
      .subscribe({
        next: ((response: any) => {
          this.collectionItems = response.data;
        }),
        error: (error => {
          console.error("ERROR: " + error);
          console.log("ERROR CAPTURADO!")
        })
      });
  }

  fetchCurrentUser() {
    return this.httpClient.get(this.base + "users/me");
  }

  getCurrentUser() {
    return this.userData;
  }

  createItem(collection: string, item: any) {
    // Dada una colleccion, nos interesaria obtener un objeto para conocer su estructura, cada collection tendra un objeto con sus propios campos

    return this.httpClient.post('http://localhost:8055/items/' + collection, item);
  }

  deleteItem(collection: string, id: string) {

    // this.collectionItems = this.collectionItems.filter((item: any) => item.id !== id);

    //Obtenemos los campos de la coleccion actual
    this.getFields().forEach(element => {
      console.log("ELEMENTO: " + element.collection + " " + element.id + " " + element.field + " ESPECIAL: " + element.meta.special)

      // Si el campo es m2m, significa que deberemos tambien borrar los elementos de la tabla intermedia.
      if(element.meta.field != 'students' && element.meta.special == 'm2m') {

        console.log("THIS COLLECTION ITEMS: " + JSON.stringify(this.collectionItems))

        // Obtenemos los elementos de la tabla intermedia
        this.httpClient.get(this.urlBase + collection + "_" + this.capitalize(element.meta.field)).subscribe((res: any) => { 

          // Recorremos los elementos de la tabla intermedia
          res.data.forEach((e:any) => {

            // Si el id de la coleccion actual es igual al id del elemento de la tabla intermedia, borramos el elemento.
            if(e[collection + "_id"] == id) {

              this.httpClient.delete('http://localhost:8055/items/' + collection + "_" + this.capitalize(element.meta.field) + '/' + e.id).subscribe();
            }
          });
        });

      }
    });
    
    return this.httpClient.delete('http://localhost:8055/items/' + collection + '/' + id);
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

  downloadFile(fileUrl: string) {
    this.httpClient.get(fileUrl, { responseType: 'blob' })
      .subscribe({
        next: ((response: Blob) => {

          //Creamos la url
          const url = window.URL.createObjectURL(response);

          //Creamos un elemento anchor, establecemos el href a la url, el nombre del archivo descargado y hacemos clic
          const a = document.createElement('a');
          a.href = url;
          a.download = 'archivo_descargado';
          a.click();

          //Eliminamos el objeto url creado anteriormente
          window.URL.revokeObjectURL(url);
        }),
        error: (error => {
          console.error('Error al descargar el archivo:', error);
        }),
      });
  }

  uploadFile(file: File) {

    //Inicializamos un objeto formulario
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    // const headers = new HttpHeaders({
    //   'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '[]').access_token
    // });

    this.httpClient.post('http://localhost:8055/files', formData).subscribe((response: any) => {
      console.log('Archivo subido con éxitoo:', response);
      this.fileID = response.data.id;
    }, error => {
      console.error('Error al subir el archivo:', error);
    });
  }

  getData() {
    return this.data;
  }

  getCollections() {
    return this.collections;
  }

  getCollectionItems() {
    return this.collectionItems;
  }

  getFields() {
    // if(sessionStorage.getItem('language') != 'default') {
    //   this.fields = this.languageService.checkLanguage((sessionStorage.getItem('language') || ''), this.fields);
    // }
    return this.fields;
  }

  getFileID() {
    return this.fileID;
  }
  
  getSpecialFields() {
    return this.specialFields;
  }



}
