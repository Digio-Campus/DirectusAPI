import { Component } from '@angular/core';
import { DirectusService } from '../directus.service';
import { LoginService } from '../login.service';
import { CollectionComponent } from '../collection/collection.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CollectionComponent],
  templateUrl: './content.component.html'
})
export class ContentComponent {
  private access_token = JSON.parse(sessionStorage.getItem("user") || '[]').access_token;

  constructor(private directusService:DirectusService, private loginService:LoginService) {

    if (this.isAuthenticated()) {
      this.directusService.fetchCollections(this.access_token);
    }
  }
  

  getCollections() {
    return this.directusService.getCollections();
  }

  isAuthenticated() {
    return this.loginService.getAuthenticationStatus();
  }
}
