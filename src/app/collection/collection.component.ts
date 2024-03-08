import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [],
  templateUrl: './collection.component.html'
})
export class CollectionComponent {
  @Input() collection:any

  constructor(private router:Router) { }


  mostrarDatos(collection:any) {
    console.log("mostrar " + collection.collection)
    this.router.navigate(['/collectionDetails', collection.collection]);
  }

}
