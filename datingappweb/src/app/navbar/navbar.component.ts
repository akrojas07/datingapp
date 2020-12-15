import { Component, OnInit } from '@angular/core';
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
  loggedIn: boolean;
  collapsed: boolean;
  loginModel: UserLoginRequest;

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
        this.loggedIn = true;
        this.router.navigateByUrl('/matches');
      }
    );
  }
  
  signedIn(){
    this.loggedIn = this.accountServices.loggedIn();
  }

  logout(): void{
    this.accountServices.logout(localStorage.getItem('un')); 
    this.loggedIn = false;
    localStorage.clear(); 
    this.router.navigateByUrl('/');
  }
}
