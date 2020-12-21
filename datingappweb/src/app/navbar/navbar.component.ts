import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginRequest } from '../_models/_userModels/UserLoginRequest';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  model: any = { };
  collapsed: boolean;
  loginModel: UserLoginRequest;
  loggedIn:boolean; 

  @ViewChild('loginForm') loginForm;

  constructor(private accountServices: AccountService,
              private router: Router) { }

  ngOnInit() {
    this.collapsed = true;
    this.loginModel = new UserLoginRequest(); 
    this.signedIn();
  }

  login(){
    this.accountServices.login(this.loginModel).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('un', response.un);
        localStorage.setItem('fn', response.fn);
        localStorage.setItem('ln', response.ln);
        localStorage.setItem('url', response.url);
        this.loggedIn = true;
        this.router.navigateByUrl('/home');
        this.loginForm.reset();
      }
    );
  }
  
  signedIn(){
    return this.accountServices.loggedIn();
  }

  logout(): void{
    this.accountServices.logout(localStorage.getItem('un')); 
    this.loggedIn = false;
    localStorage.clear(); 
    this.router.navigateByUrl('/');
  }
}
