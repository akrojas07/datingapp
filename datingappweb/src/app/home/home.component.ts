import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService} from '../_services/account.service';
import { GetUsersByUserIdResponse} from '../_models/_userModels/GetUsersByUserIdResponse';

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

  @ViewChild('registerForm') registerForm;  

  constructor(private accountServices: AccountService,
    private router: Router) { }

  ngOnInit() {
    this.loggedIn(); 
    this.registerMode = false;
    this.newUser = new CreateNewUserRequest();
  }

  loggedIn(){
    this.signedIn = this.accountServices.loggedIn(); 
    return this.signedIn;
  }

  registerToggle(){
    this.registerMode = true;
  }

  register(){
    // console.log(this.newUser.Picture);
    this.accountServices.createNewUser(this.newUser).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('un', response.un);
        localStorage.setItem('fn', response.fn);
        localStorage.setItem('ln', response.ln);
        localStorage.setItem('url', response.url);
        this.signedIn = this.accountServices.loggedIn();
        this.router.navigateByUrl('/home');
        this.registerForm.reset();
      }
    );
  }

  cancel(){
    this.registerForm.reset();
    this.registerMode = false;
  }
}
