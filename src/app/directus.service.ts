import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DirectusService {

  private data:Array<any> = []
  private collections:any[] = [];
  private collectionItems:Array<any> = []
  private urlBase = "http://localhost:8055/items/"
  private urlCollections = "http://localhost:8055/collections"
  // Course?access_token=N9dMkfzgZmSYt81ZfJnwRibPvUm0IOW-

  constructor(private httpClient: HttpClient) {
    
    this.data = JSON.parse(localStorage.getItem("data") || '[]');
    this.collections = JSON.parse(localStorage.getItem("collections") || '[]');
    this.collectionItems = JSON.parse(localStorage.getItem("collectionItems") || '[]');




  }

  // fetchData(entity:string, token:string) {
  //   this.httpClient.get(this.urlBase + entity + "?access_token=" + token)
  //     .subscribe((response: any) => {

  //       this.data = response.data;

  //       localStorage.setItem("data", JSON.stringify(response.data))

  //     })
  // }

  fetchCollections(token:string) {
    this.httpClient.get(this.urlCollections + "?access_token=" + token)
      .subscribe((response: any) => {

        this.collections = response.data;

        localStorage.setItem("collections", JSON.stringify(response.data))

      })
  }

  fetchCollectionItems(collection:string, token:string) {
    this.httpClient.get(this.urlBase + collection + "?access_token=" + token)
      .subscribe((response: any) => {

        this.collectionItems = response.data;


        localStorage.setItem("collectionItems", JSON.stringify(response.data))

      })
  }

  getData() {
    return this.data;
  }

  getCollections() {
    return this.collections;
  }

  getCollectionItems() {
    return this.collectionItems;
  }



}
