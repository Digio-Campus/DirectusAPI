import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContentComponent } from './content/content.component';
import { CollectionDetailsComponent } from './collection-details/collection-details.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        title: 'Login',
    },
    {
        path: 'home',
        component: ContentComponent,
        title: 'Content',
    },
    {
        path: 'contentDetails',
        component: CollectionDetailsComponent,
        title: 'Collecion Details',
    },
    { 
        path: 'collectionDetails/:collection', 
        component: CollectionDetailsComponent
    }
];
