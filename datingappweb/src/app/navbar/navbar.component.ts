import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private accountService: AccountService,
              private router: Router) { }

  ngOnInit() {
    this.loggedIn = false;
    this.collapsed = true;
  }

  login(): void{
    console.log(this.model);
    this.loggedIn = true;
    this.router.navigateByUrl('/matches');
    // this.accountService.login(this.model)
    // .subscribe(
    //   response =>{
    //     console.log(response);
    //     this.loggedIn = true;
    //   }, error =>{
    //     console.log(error);
    //   }
    // );
  }

  logout(): void{
    this.loggedIn = false;
    this.router.navigateByUrl('/');
  }
}
