import { Component, Input } from '@angular/core';
import { CollectionComponent } from '../collection/collection.component';
import { DirectusService } from '../directus.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [CollectionComponent, RouterModule],
  templateUrl: './collection-details.component.html'
})
export class CollectionDetailsComponent {

  @Input() collection: any;

  private keys:string[] = [];
  private token = JSON.parse(sessionStorage.getItem("user") || '[]').access_token;

  constructor(private directusService: DirectusService, private route: ActivatedRoute, private loginService:LoginService) {
    this.route.params.subscribe(params => {
      this.collection = params['collection'];
      console.log('Valor de collection:', this.collection);


    });



    //Hacemos fetch de los objetos de la coleccion elegida por el usuario
    // this.directusService.fetchCollectionItems(this.collection, "N9dMkfzgZmSYt81ZfJnwRibPvUm0IOW-");
    this.directusService.fetchCollectionItems(this.collection, this.token);

    this.keys.push(...Object.keys(this.getCollectionItems()[0]))

    console.log("KEYS: " + this.keys)


  }

  getCollectionItems() {
    return this.directusService.getCollectionItems();
  }

  getFields() {
    return this.keys;
  }

  isAuthenticated() {
    return this.loginService.getAuthenticationStatus();
  }


}
