import { Component, OnInit } from '@angular/core';

import { ChatsService } from '../_services/chats.service';
import { AccountService } from '../_services/account.service';
import { MatchesService } from '../_services/matches.service';
import { GetChatsResponse } from '../_models/_chatsModels/GetChatsResponse';
import { AddChatsRequest } from '../_models/_chatsModels/AddChatsRequest';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  userChats: GetChatsResponse[];
  matchChats: GetChatsResponse[];

  currentUserId: number;

  retrievalUserError: string; 
  showRetrievalUserError: boolean;
  
  retrievalMatchError: string; 
  showRetrievalMatchError: boolean;
  constructor(private chatService: ChatsService,
              private accountService: AccountService,
              private matchesServices: MatchesService) {}

  ngOnInit() {
    this.matchChats = [];
    this.retrievalUserError='';
    this.showRetrievalUserError = false;

    this.retrievalMatchError = '';
    this.showRetrievalMatchError = false;

    this.getChatsByMatchId(51);
  }

  // User methods
  getUserDetail(){
    var username = localStorage.getItem('un');
    this.accountService.getUserByUsername(username)
    .subscribe(
      response => {
        this.currentUserId = response.id;
      },(error) =>{
        this.retrievalUserError = error;
        this.showRetrievalUserError = true;
      }
    );
  }

  //Matches methods
  getMatchDetail(){
    // this.matchesServices.getMatchByMatchId().subscribe();
  }

  // Chat methods
  addNewChat(chat: AddChatsRequest) {
    this.chatService.addChat(chat).subscribe();
  }

  getChatsByUserId(userId: number) {
    this.chatService.getChatsByUserId(userId).subscribe((response) => {
      this.userChats = response;
    }, (error) =>{
      this.retrievalUserError = error; 
      this.showRetrievalUserError = true; 
    });
  }

  getChatsByMatchId(matchId: number) {
    this.chatService.getChatsByMatchId(matchId).subscribe((response) => {
      this.matchChats = response;
    }, (error) =>{
      this.retrievalMatchError = error; 
      this.showRetrievalMatchError = true; 
    });
  }

  deleteChat(chatId: number) {
    this.chatService.deleteChatByChatId(chatId).subscribe();
  }
}
