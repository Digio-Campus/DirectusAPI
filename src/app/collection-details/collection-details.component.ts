import { Component, inject } from '@angular/core';
import { CollectionComponent } from '../collection/collection.component';
import { DirectusService } from '../directus.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';
import { FormsModule } from '@angular/forms';
import { LanguagesService } from '../languages.service';
import { Subscription } from 'rxjs';
import { ManageItemsComponent } from '../manage-items/manage-items.component';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [CollectionComponent, RouterModule,FormsModule, ManageItemsComponent],
  templateUrl: './collection-details.component.html'
})
export class CollectionDetailsComponent {

  datosHijo:any;



  private collection:any;
  public lang:any = (localStorage.getItem('language') || 'default');
  private subscription: Subscription;


  public prueba = JSON.parse(sessionStorage.getItem('collection') || '{}');

  route = inject(ActivatedRoute)

  constructor(private loginService:LoginService, public directusService:DirectusService, private languagesService:LanguagesService) {
    this.route.params.subscribe(params => {
      this.collection = params['collection'];
      console.log('Valor de collection:', this.collection);
    });

    console.log("prueba " + this.prueba.collection.meta + " " + this.prueba.items + " " + this.prueba.fields)

    // Hacemos fetch de los campos y sus elementos
    this.directusService.fetchCollectionItems(this.collection);
    this.directusService.fetchFields(this.collection);

    // let TEST = this.languagesService.comprobarIdioma(this.lang, this.getCollectionItems(), this.getFields());

    console.log("CAMPOS TRANSLATION: " + this.languagesService.getCamposTranslation());

    this.subscription = this.languagesService.collectionId$.subscribe(langId => {
      this.lang = langId;

      const modalDiv2 = document.getElementById('myModal2');

      if (modalDiv2) {
        modalDiv2.style.display = "block";
    }


    });

    let prueba = this.languagesService.checkLanguage(this.lang, this.directusService.getFields());

    console.log("MOSTRAR DATOS HIJO: " + this.datosHijo);

  }

  getCollectionItems() {
    return this.directusService.getCollectionItems();
  }
  
  deleteCollectionItem(id: string) { 
    this.directusService.deleteItem(this.collection, id).subscribe((response: any) => {
      console.log('Item eliminado con éxito:', response);
      this.directusService.fetchCollectionItems(this.collection);
    });
  }

  deleteCollection() {
    console.log("GET ESPECIAL FIELDS DESDE COLLECTION DETAILS:  "  + JSON.stringify(this.directusService.getSpecialFields()));
  }


  getFields():any {
    // if( this.languagesService.comprobarCampos(this.lang, this.directusService.getFields()) ) {
    //   return this.languagesService.getCamposTranslation();
    // }
    return this.directusService.getFields();
    // return this.languagesService.checkLanguage(this.lang, this.directusService.getFields())
  }

  isAuthenticated() {
    return this.loginService.getAuthenticationStatus();
  }

  refreshToken() {
    console.log("refresh token")
    this.loginService.rfrToken()?.subscribe(() => {});
  }

  isTokenExpired() {
    console.log("IS TOKEN EXPIRED?" + this.loginService.isTokenExpired())
    return this.loginService.isTokenExpired();
  }

  getLanguagesAvailable() {
    return this.languagesService.getLanguagesAvailable();
  }

  getCollection() {
    return this.collection;
  }

  getDatosHijo(data:string) {
    console.log("DATOS HIJO: " + data);
    this.datosHijo = data;
  }

}
