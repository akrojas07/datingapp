import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService} from '../_services/account.service';
import { GetUsersByUserIdResponse} from '../_models/_userModels/GetUsersByUserIdResponse';
import { UserLoginRequest } from '../_models/_userModels/UserLoginRequest';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { CreateNewUserRequest } from '../_models/_userModels/CreateNewUserRequest';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users: GetUsersByUserIdResponse[] = []; 
  signedIn: boolean; 
  registerMode: boolean;
  newUser: CreateNewUserRequest;


  constructor(private accountServices: AccountService,
    private router: Router) { }

  ngOnInit() {
    this.loggedIn(); 
    //this.getUsersByUserId([1]);
    this.registerMode = false;
    this.newUser = new CreateNewUserRequest();
  }

  getUsersByUserId(ids:number[]): void{
    this.users = [];

    this.accountServices.getUsersByUserId(ids).subscribe(
      response => {
        console.log(response);
        this.users = response;
      },
      error =>{
        console.log(error);
      }
    );
  }

  loggedIn(){
    this.signedIn = this.accountServices.loggedIn(); 
  }

  registerToggle(){
    this.registerMode = true;
  }

  register(){
    console.log(this.newUser);
    this.accountServices.createNewUser(this.newUser).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('un', response.un);
        this.signedIn = this.accountServices.loggedIn();
        this.router.navigateByUrl('/matches');
      }
    );
  }

  cancel(){
    console.log("cancelled");
  }
}
