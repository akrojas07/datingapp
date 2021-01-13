import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

import { GetChatsResponse } from '../_models/_chatsModels/GetChatsResponse';
import { AddChatsRequest } from '../_models/_chatsModels/AddChatsRequest';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  baseUrl = environment.chatsApiUrl;
  jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient) {}

  addChat(body:AddChatsRequest){
    return this.http.post(this.baseUrl+'newchat', body);
  }

  getChatsByMatchId(matchId: number){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    });

    return this.http.get<GetChatsResponse[]>(this.baseUrl+'getchats/match/'+matchId, {headers});
  }
  
  getChatsByUserId(userId: number){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    });
    return this.http.get<GetChatsResponse[]>(this.baseUrl+'getchats/user/'+userId, {headers});

  }

  deleteChatByChatId(chatId: number){
    return this.http.delete(this.baseUrl+'chat/'+chatId);
  }

}
