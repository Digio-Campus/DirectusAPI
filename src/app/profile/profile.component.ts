import { Component } from '@angular/core';
import { DirectusService } from '../directus.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private userData:any[] = [];

  constructor(private directusService:DirectusService) { 
    

    // this.directusService.fetchCurrentUser();
    // console.log("DESDE EL CONSTRUCTOR DE PROFILEEE" + this.fetchProfile())

    this.fetchProfile();

    console.log("THIS GET PROFILE: " + this.getProfile().id);
  }

  fetchProfile() {
    this.directusService.fetchCurrentUser().subscribe((response:any) => {
      sessionStorage.setItem('user', JSON.stringify(response.data));
      this.userData = response.data;

      console.log("DENTRO FETCH CURRENT USER: " + this.userData)
    })

    // console.log("USERDATA: " + this.userData)

    // this.directusService.getCurrentUser();
  }

  getProfile() {
    return JSON.parse(sessionStorage.getItem('user') || '[]');
  }
}
