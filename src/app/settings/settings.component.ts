import { Component, Input } from '@angular/core';
import { LoginService } from '../login.service';
import { LanguagesService } from '../languages.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  // @Input() language:string = 'default';
  language:string = 'default';

  constructor(private loginService:LoginService, private languagesService:LanguagesService) { }

  
  logOut() {
    this.loginService.logOut();
  }
  
  // selectedLanguage(language:string) {
  //   this.language = language;
  //   console.log("idioma seleccionado: " + this.language)
  // }

  // getLanguage() {

  // }

  setLanguage(language:string) {
    console.log("language: " + language)
    // this.languagesService.language = language;
    this.languagesService.setCollectionId(language);
    localStorage.setItem('language', language);

    // console.log("languageService: " + this.languagesService.language)
  }
  

}
