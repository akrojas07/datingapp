import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserLoginRequest } from '../_models/_userModels/UserLoginRequest';
import { UserLoginResponse } from '../_models/_userModels/UserLoginResponse';
import { CreateNewUserRequest } from '../_models/_userModels/CreateNewUserRequest';
import { GetUsersByUserIdResponse } from '../_models/_userModels/GetUsersByUserIdResponse';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.userApiUrl;
  jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient) {}

  createNewUser(model: CreateNewUserRequest): Observable<UserLoginResponse>{
    return this.http.post<UserLoginResponse>(this.baseUrl + 'user/new', model);
  }

  getUsersByUserId(body: any[]): Observable<GetUsersByUserIdResponse[]>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    });
    return this.http.put<GetUsersByUserIdResponse[]>(this.baseUrl + 'user', body, {headers});
  }

  login(model: UserLoginRequest): Observable<UserLoginResponse> {
    return this.http.patch<UserLoginResponse>(this.baseUrl + 'user/login', model);
  }

  deleteUser(body: any): Observable<any>{
    return this.http.delete(this.baseUrl + 'user/delete', body);
  }

  logout(username: string){
    return this.http.patch(this.baseUrl + 'logout', username);
  }

  loggedIn():boolean{
    const token = localStorage.getItem('token');
    if(token != null){
      return !this.jwtHelper.isTokenExpired(token);
    }
    const username = localStorage.getItem('username');
    if(username == null)
    {
      return false;
    }
  }

}
