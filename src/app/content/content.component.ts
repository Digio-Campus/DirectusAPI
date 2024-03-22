import { Component } from '@angular/core';
import { DirectusService } from '../directus.service';
import { LoginService } from '../login.service';
import { CollectionComponent } from '../collection/collection.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CollectionComponent, RouterModule],
  templateUrl: './content.component.html'
})
export class ContentComponent {
  lang:any;
  
  constructor(private directusService:DirectusService, private loginService:LoginService) {
    this.directusService.fetchCollections();
  }

  getCollections() {
    return this.directusService.getCollections();
  }

  isAuthenticated() {
    return this.loginService.getAuthenticationStatus();
  }

  download() {
    const fileUrl = 'http://localhost:8055/assets/a1b0ad08-d3f4-4b25-99e1-e227fc3843f5?download';
    this.directusService.downloadFile(fileUrl);
  }

  handleFileInput(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files && files.length > 0) {
      const fileToUpload = files[0];
      this.directusService.uploadFile(fileToUpload);
    } else {
      console.error('No se seleccionó ningún archivo.');
    }
  }

  refreshToken() {
    console.log("refresh token")
    this.loginService.rfrToken()?.subscribe(() => {});
  }

  isTokenExpired() {
    console.log("IS TOKEN EXPIRED?" + this.loginService.isTokenExpired())
    return this.loginService.isTokenExpired();
  }
}
