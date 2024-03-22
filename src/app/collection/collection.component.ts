import { Component, Input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DirectusService } from '../directus.service';
import { CollectionDetailsComponent } from '../collection-details/collection-details.component';
import { LanguagesService } from '../languages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [RouterModule, CollectionDetailsComponent],
  templateUrl: './collection.component.html'
})
export class CollectionComponent {
  @Input() collection:any
  private subscription: Subscription;
  public lang:any = (localStorage.getItem('language') || 'default');


  constructor(private directusService:DirectusService, private languagesService:LanguagesService) { 
    this.subscription = this.languagesService.collectionId$.subscribe(langId => {
      this.lang = langId;

    });
  }

  router = inject(Router);

  mostrarDatos(collection:any) {

    collection = {
      collection: collection
    }

    // Guardamos la colección en el sessionStorage
    sessionStorage.setItem('collection', JSON.stringify(collection));

    console.log("MOSTRAR DATOS")
    this.router.navigate(['/collectionDetails', collection.collection.collection]);
  }

}
