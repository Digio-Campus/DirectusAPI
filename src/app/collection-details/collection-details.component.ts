import { Component, Input, inject } from '@angular/core';
import { CollectionComponent } from '../collection/collection.component';
import { DirectusService } from '../directus.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [CollectionComponent, RouterModule,FormsModule],
  templateUrl: './collection-details.component.html'
})
export class CollectionDetailsComponent {

  @Input() collection: any;
  collectionItems:any[] = [];
  @Input() testing:any[] = [];

  private keys:string[] = [];


  route = inject(ActivatedRoute)

  constructor(private loginService:LoginService, public directusService:DirectusService) {

    this.route.params.subscribe(params => {
      this.collection = params['collection'];
      console.log('Valor de collection:', this.collection);
    });


    //Hacemos fetch de los campos y los objetos de la colección clickeada por el usuario
    this.directusService.fetchCollectionItems(this.collection);
    let fields = this.directusService.fetchFields(this.collection);

    console.log(this.getFields())
    // let prueba = this.directusService.getFields();
    // console.log("fields: " + this.directusService.fetchFields(this.collection))
    // console.log("fields: " + JSON.stringify(prueba))

    // this.getPruebas().forEach(e => {
    //   console.log("eee _ " + JSON.stringify(e))
    // });

    // let test = Object.keys(this.directusService.getCollectionItems()[0] || '[]')

    // console.log("getCollectionItems: " + test);


    // this.ngZone.run(() => {
    //   console.log("NG ZONE!")
    //   this.keys.push(...Object.keys(this.getCollectionItems()[0]))
    //   // this.test = JSON.parse(localStorage.getItem("collectionItems") || '[]');
    // console.log("COLLECTION ITEMS: " + this.directusService.getCollectionItems())
    // // window.location.reload()


    // })

    if (this.keys != null && this.keys != undefined && this.getCollectionItems() && this.getCollectionItems().length > 0) {
      this.keys.push(...Object.keys(this.getCollectionItems()[0]));
    } else {
      console.error('No hay datos disponibles');
    }


    // this.cdr.detectChanges();
    // this.directusService.fetchFields(this.collection);

    // console.log("ESTO ES UNA PRUEBA DE TEST: " + JSON.stringify(this.prueba));

    //Hacemos fetch de los objetos de la coleccion elegida por el usuario
    // this.directusService.fetchCollectionItems(this.collection, "N9dMkfzgZmSYt81ZfJnwRibPvUm0IOW-");


    // console.log("KEYS: " + this.keys)

    // this.cdr.detectChanges();
  }

  dataLoaded = false;
  

  receivedData: any;

  processData(data: any) {
    // Procesa los datos recibidos
    this.receivedData = data;
    console.log('Datos recibidos en el componente hijo:', this.receivedData);
  }

  getCollectionItems() {
    // return this.test;
    // return this.collectionItems;
    return this.directusService.getCollectionItems();
  }

  getFields() {
    return this.keys;
  }

  isAuthenticated() {
    return this.loginService.getAuthenticationStatus();
  }

  obtainFields() {
    return this.directusService.getFields();
  }

  getPruebas() {
    return this.directusService.getFields();
  }


}
