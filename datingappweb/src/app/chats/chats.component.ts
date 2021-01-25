import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ChatsService } from '../_services/chats.service';
import { AccountService } from '../_services/account.service';

import { GetChatsResponse } from '../_models/_chatsModels/GetChatsResponse';
import { AddChatsRequest } from '../_models/_chatsModels/AddChatsRequest';




@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {

  newChat: AddChatsRequest;
  userChats: GetChatsResponse[];
  uniqueUserChats: GetChatsResponse[];
  groupedChats: GetChatsResponse[];
  matchChats: GetChatsResponse[];

  currentUserId: number;
  currentMatchedUserId: number;
  currentMatchId: number;

  currentUsername: string;

  retrievalUserError: string;
  showRetrievalUserError: boolean;

  retrievalMatchError: string;
  showRetrievalMatchError: boolean;

  retrievalChatAddError: string;
  showRetrievalChatAddError: boolean;

  @ViewChild('chatsForm') chatsForm;  

  constructor(
    private chatService: ChatsService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentMatchedUserId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
  }

  ngOnInit() {
    this.newChat = new AddChatsRequest();
    this.matchChats = [];

    this.retrievalChatAddError = '';
    this.showRetrievalChatAddError = false;
    this.retrievalUserError = '';
    this.showRetrievalUserError = false;
    this.retrievalMatchError = '';
    this.showRetrievalMatchError = false;

    this.currentUsername = localStorage.getItem('un');
    this.getUserDetail();    
  }

  // User methods
  getUserDetail() {
    this.accountService.getUserByUsername(this.currentUsername).subscribe(
      (response) => {
        this.currentUserId = response.id;
        this.getChatsByUserId(this.currentUserId);
      },
      (error) => {
        this.retrievalUserError = error;
        this.showRetrievalUserError = true;
      }
    );
  }

  // Chat methods
  addNewChat() {
    this.newChat.firstUserId = this.currentUserId;
    this.newChat.secondUserId = this.currentMatchedUserId; 
    this.newChat.matchId = this.currentMatchId; 

    this.chatService.addChat(this.newChat).subscribe((response) => {
      var addedChat = new GetChatsResponse();
      addedChat.matchId = this.newChat.matchId;
      addedChat.firstUserId = this.newChat.firstUserId;
      addedChat.firstUsername = this.currentUsername;
      addedChat.secondUserId = this.newChat.secondUserId;
      addedChat.message = this.newChat.message;
      addedChat.dateSent = new Date();
      this.userChats.push(addedChat);
      this.chatsForm.reset();
    }, error =>{
      this.retrievalChatAddError = 'Unable to send message. Please try again';
      this.showRetrievalChatAddError = true;
    });
  }

  getChatsByUserId(userId: number) {
    this.chatService.getChatsByUserId(userId).subscribe(
      (response) => {
        this.userChats = response;
        // sort in descending order
        this.userChats.sort((a, b) => (a.dateSent > b.dateSent ? -1 : 1));
        let map = this.groupUserChats();
        this.uniqueUserChats = [];
        map.forEach((chat) => {
          this.uniqueUserChats.push(chat[0]);
        });
        this.setCurrentMatchId();

        //sort back into descending order - important for the individual chat messages
        this.userChats.sort((a,b) => (a.dateSent < b.dateSent ? -1 : 1))
      },
      (error) => {
        this.retrievalUserError = error;
        this.showRetrievalUserError = true;
      }
    );
  }

  getChatsByMatchId(matchId: number) {
    this.chatService.getChatsByMatchId(matchId).subscribe(
      (response) => {
        this.matchChats = response;
      },
      (error) => {
        this.retrievalMatchError = error;
        this.showRetrievalMatchError = true;
      }
    );
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

  setCurrentMatchId() {
    var currenChat;
    if (this.currentMatchedUserId != null && this.currentMatchedUserId > 0) {
      currenChat = this.userChats.find(
        (chat) =>
          chat.firstUserId == this.currentMatchedUserId ||
          chat.secondUserId == this.currentMatchedUserId
      );
    }
    else{
      currenChat = this.uniqueUserChats[0];
    }

    if (currenChat !== null) {
      this.currentMatchId = currenChat.matchId;
      this.currentMatchedUserId = currenChat.secondUserId;
    }
  }

  updateCurrentMatchId(matchId: number)
  {
    this.currentMatchId = matchId;
  }

}
