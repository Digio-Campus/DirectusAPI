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
    this.fetchProfile();
  }

  fetchProfile() {
    this.directusService.fetchCurrentUser().subscribe((response:any) => {
      sessionStorage.setItem('user', JSON.stringify(response.data));
      this.userData = response.data;

    })

  }

  getProfile() {
    return JSON.parse(sessionStorage.getItem('user') || '[]');
  }
}
