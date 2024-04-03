import { Injectable } from '@angular/core';
import {User} from "../../models/user/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Publication} from "../../models/publication/publication";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private baseUrl = "http://localhost:8080/";
  constructor(private client: HttpClient, private userService:UserService) { }

  postPublication(user: any):Observable<any>{
    return this.client.post(this.baseUrl + "pub/new", user);
  }
  postSearch(search: any):Observable<any>{
    let headers: HttpHeaders = new HttpHeaders({
      Authorization: "Bearer "+ this.userService.token
    })
    console.log(headers)
    return this.client.get(this.baseUrl + "pub/list",{headers:headers});
  }
  get(id: string):Observable<any>{
    return this.client.get(this.baseUrl + "pub/" + id);
  }


}
