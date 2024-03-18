import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  private languagesAvailable = ['es-ES', 'en-EN'];
  private camposTranslation: any[] = [];

  private collectionIdSubject = new Subject<string>();
  collectionId$ = this.collectionIdSubject.asObservable();

  constructor() { }

  //Metodo para cambiar el idioma
  setCollectionId(collectionId: string) {
    this.collectionIdSubject.next(collectionId);
  }

  getLanguagesAvailable() {
    return this.languagesAvailable;
  }



  // Funcion para comprobar el idioma seleccionado por el usuario, 
  //Si el idioma esta en default se mostrara el idioma por defecto
  checkLanguage(language: string, collection: any):any {

    if (collection != null && collection != undefined) {
      
    collection.forEach((e: any) => {
      // console.log("wqedfwefwefwe " + JSON.stringify(e.meta.translations))

      if (e.meta.translations != null && e.meta.translations != undefined) {
        e.meta.translations.forEach((b: any) => {

          if (b.language == language) {
            // console.log("idioma: " + b.language + " " + b.translation)
            // console.log("b translation: " + b.translation)
            return b.translation;
          }

        });
      }
      else
        return collection;
      // console.log("e collection : " + collection)
    });
  }
  else {
    console.log("COLLECTION UNDEFINED")
  }

  }

  comprobarIdioma(lang:string, collection:any, fields:any) {

    let campos;
    if (lang != 'default' && collection) {
      console.log("LANG NO ES DEFAULT")

      collection.forEach((e: any) => {
        // console.log("wqedfwefwefwe " + JSON.stringify(e.meta.translations))
  
        if (e.meta.translations) {
          e.meta.translations.forEach((b: any) => {
  
            if (b.language == lang) {
              // console.log("idioma: " + b.language + " " + b.translation)
              // console.log("b translation: " + b.translation)
              campos = e.meta.translations;
              // return b.translation;
            }
  
          });
        }
        else
          return collection;
        // console.log("e collection : " + collection)
      });
    }
  }



  comprobarCampos(lang:string, fields:any) {
    console.log("FIELDS: " + JSON.stringify(fields))

    if(lang != 'default') {
      fields.forEach((e:any) => {
        console.log("VALOR DE E: " + e);

        if(e.meta.translations) {
          console.log("hay translations!")
          this.camposTranslation = e.meta.translations;
          e.meta.translations.forEach((b:any) => {
            // this.camposTranslation.push(b);
            // console.log("idioma: " + b.language + " " + b.translation)
          });
        }
        else
          console.log("no hay translations")
      });
      return true;
    }
    return false;
  }

  getCamposTranslation() {
    return this.camposTranslation;
  }


}
