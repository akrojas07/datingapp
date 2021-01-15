import { Component, OnInit } from '@angular/core';

import { ChatsService } from '../_services/chats.service';
import { AccountService } from '../_services/account.service';

import { GetChatsResponse } from '../_models/_chatsModels/GetChatsResponse';
import { AddChatsRequest } from '../_models/_chatsModels/AddChatsRequest';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  userChats: GetChatsResponse[];
  uniqueUserChats: GetChatsResponse[];
  matchChats: GetChatsResponse[];

  currentUserId: number;
  currentMatchedUserId: number; 
  currentMatchId: number; 

  currentUsername: string;
  currentMatchesUsernames: string[];
  currentMatchesIds: number[];

  retrievalUserError: string; 
  showRetrievalUserError: boolean;
  
  retrievalMatchError: string; 
  showRetrievalMatchError: boolean;

  constructor(private chatService: ChatsService,
              private accountService: AccountService,    
              private activatedRoute: ActivatedRoute) 
              { 
                this.currentMatchedUserId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
              }

  ngOnInit() {
    this.matchChats = [];
    this.currentMatchesUsernames = [];
    this.retrievalUserError='';
    this.showRetrievalUserError = false;

    this.retrievalMatchError = '';
    this.showRetrievalMatchError = false;

    this.currentUsername = localStorage.getItem('un');
    this.getUserDetail(); 
  }

  // User methods
  getUserDetail(){
    this.accountService.getUserByUsername(this.currentUsername)
    .subscribe(
      response => {
        this.currentUserId = response.id;
        this.getChatsByUserId(this.currentUserId);
      },(error) =>{
        this.retrievalUserError = error;
        this.showRetrievalUserError = true;
      }
    );
  } 

  getMatchedUserDetails(){
    this.accountService.getUsersByUserId(this.currentMatchesIds).subscribe();
  }



  // Chat methods
  addNewChat(chat: AddChatsRequest) {
    this.chatService.addChat(chat).subscribe(
      response => {
        var addedChat = new GetChatsResponse();
        addedChat.matchId = chat.matchId;
        addedChat.firstUserId = chat.firstUserId;
        addedChat.secondUserId = chat.secondUserId;
        addedChat.message = chat.message;
        console.log(response);
        this.userChats.push(addedChat);
      }
    );
  }

  deleteChat(chatId: number) {
    this.chatService.deleteChatByChatId(chatId).subscribe();
  }

  getChatsByUserId(userId: number) {
    this.chatService.getChatsByUserId(userId).subscribe((response) => {
      this.userChats = response;
      // sort in descending order
      this.userChats.sort((a,b) => a > b ? 1 : -1);
      let map = this.groupUserChats();
      this.uniqueUserChats = [];
      map.forEach((chat) =>{
        this.uniqueUserChats.push(chat[0]);
      });

    }, (error) =>{
      this.retrievalUserError = error; 
      this.showRetrievalUserError = true; 
    });
  }

  getChatsByMatchId() {
    this.chatService.getChatsByMatchId(this.currentMatchId).subscribe((response) => {
      this.matchChats = response;
    }, (error) =>{
      this.retrievalMatchError = error; 
      this.showRetrievalMatchError = true; 
    });
  }

  groupUserChats() {
    const map = new Map();
    this.userChats.forEach((item) => {
         const key = item.matchId;
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    
    return map;

}


  setCurrentMatchId(){
    var currentMatch = this.userChats.find(chat => chat.firstUserId == this.currentMatchedUserId || chat.secondUserId == this.currentMatchedUserId);

    if(currentMatch !== null){
      this.currentMatchId = currentMatch.matchId;
    }
  }
}
