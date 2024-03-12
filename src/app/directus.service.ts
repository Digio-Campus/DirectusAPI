import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectusService {

  private data:any[] = []
  private collections: any[] = [];
  private collectionItems:any[] = []
  private fields: any[] = [];
  private urlBase = "http://localhost:8055/items/"
  private urlFields = "http://localhost:8055/"
  private urlCollections = "http://localhost:8055/collections"
  // Course?access_token=N9dMkfzgZmSYt81ZfJnwRibPvUm0IOW-

  private translations: any[] = [];
  private test: any[] = [];
  private allFields: any[] = [];
  private variablePrueba: any[] = [];
  private allCollectionItems:any[] = [];

  private collectionFields: any[] = [];

  constructor(private httpClient: HttpClient, private ngZone:NgZone ) {

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
          // localStorage.setItem("collections", JSON.stringify(response.data))
        }),
        error: (error => {
          console.error(error);
        })
      });
  }

  getColls(): Observable<any> {
    return this.httpClient.get(this.urlCollections).pipe(res=>res);
  }
  getCollItems(collection: string): Observable<any> {
    return this.httpClient.get(this.urlBase + collection).pipe(res=>res);
  }

  fetchCollectionItems(collection: string) {
    this.httpClient.get(this.urlBase + collection)
      .subscribe({
        next: ((response: any) => {
          this.collectionItems = response.data;
          // this.variablePrueba = response.data;
          // localStorage.setItem("collectionItems", JSON.stringify(response.data))
        }),
        error: (error => {
          console.error("ERROR: " + error);
        }),
        complete: () => {
          // console.log("FETCH COLLECTION ITEMS COMPLETADO")
          // localStorage.setItem("collectionItems", JSON.stringify(this.collectionItems))
        }

      });

  }

  fetchFields(collection: string) {
    this.httpClient.get(this.urlFields + "fields/" + collection)
      .subscribe((response: any) => {
        this.fields = response.data;
        const translationsArray: any = [];

        response.data.forEach((e: any) => {
          if (e.meta.translations != null) {
            // console.log("Entidad: " + e.collection + " traducciones " + e.meta.translations[0].translation)
            translationsArray.push(e.meta.translations);
            localStorage.setItem("fields", JSON.stringify(response.data))
          }
        });

        // console.log(" wruioefweuof ")
        // this.fields = translationsArray;
        console.log(this.fields)

      })
  }

  // fetchAllFields() {
  //   this.httpClient.get(this.urlFields + "fields/")
  //   .subscribe((response: any) => {
  //     const translationsArray: any = [];

  //     response.data.forEach((e: any) => {
  //       if (e.meta.translations != null) {
  //         translationsArray.push(e.meta.translations);
  //         localStorage.setItem("allFields", JSON.stringify(response.data))
  //       }
  //     });

  //     this.fields = translationsArray;
  //     console.log(this.fields)

  //   })
  // }
  // fetchFields(collection: string, token: string) {
  //   this.httpClient.get(this.urlFields + "fields/" + collection + "?access_token=" + token)
  //     .subscribe((response: any) => {
  //       // this.fields = response.data;
  //       const translationsArray: any = [];

  //       response.data.forEach((e: any) => {
  //         if (e.meta.translations != null) {
  //           console.log("Entidad: " + e.collection + " traducciones " + e.meta.translations[0].translation)
  //           translationsArray.push(e.meta.translations);
  //           localStorage.setItem("fields", JSON.stringify(response.data))
  //         }
  //       });

  //       console.log(" wruioefweuof ")
  //       this.fields = translationsArray;
  //       console.log(this.fields)

  //     })
  // }

  downloadFile(fileUrl: string) {
    // const headers = new HttpHeaders({
    //   'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '[]').access_token
    // });

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
        // complete: () => {

        // }

      });
  }

  uploadFile(file: File): void {

    //Inicializamos un objeto formulario
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user') || '[]').access_token
    });

    this.httpClient.post('http://localhost:8055/files', formData, { headers: headers })
      .subscribe(response => {
        console.log('Archivo subido con éxito:', response);
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
    return this.fields;
  }




  getPruebas() {
    return this.allCollectionItems;
  }



}
