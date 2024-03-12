import { Component, Input, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DirectusService } from '../directus.service';
import { CollectionDetailsComponent } from '../collection-details/collection-details.component';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [],
  templateUrl: './collection.component.html'
})
export class CollectionComponent {
  @Input() collection:any
  cat = 0

  constructor(private directusService:DirectusService) { 
    // this.sendDataToChild()
  }

  router = inject(Router);

  mostrarDatos(collection:any) {

    collection = {
      collection: collection.collection
    }

    // const collect = {
    //   collection: collection.collection,
    //   items: this.directusService.fetchCollectionItems(collection.collection)
    // }
    // console.log("mostrar " + collect.collection)


    console.log("MOSTRAR DATOS")
    // this.directusService.fetchCollectionItems(collection.collection);
    // this.directusService.fetchFields(this.collection.collection);

    this.router.navigate(['/collectionDetails', collection.collection]);
    // this.router.navigate(['/contentDetails']);
  }

  // @ViewChild(CollectionDetailsComponent) childComponent!: CollectionDetailsComponent;

  // sendDataToChild() {
  //   const dataToSend = 'Datos del padre al hijo';
  //   this.childComponent.processData(dataToSend);
  // }

}
