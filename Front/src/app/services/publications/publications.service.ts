import { Injectable } from '@angular/core';
import {User} from "../../models/user/user";
import {HttpClient, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Publication} from "../../models/publication/publication";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private baseUrl = "http://localhost:8080/pub/";
  constructor(private client: HttpClient, private userService:UserService) { }

  postPublication(user: any):Observable<any>{
    return this.client.post(this.baseUrl + "new", user);
  }
  search():Observable<any>{
        return this.client.get(this.baseUrl + "list", {
          headers: new HttpHeaders({'Authorization': 'Bearer ' + this.userService.token})
        })
  }
  postSearch(search: any):Observable<any>{
    return this.client.post(this.baseUrl + "search",search, {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.userService.token})
    })
  }

  get(id: string):Observable<any>{
    return this.client.get(this.baseUrl + id);
  }


}
