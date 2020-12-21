import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import{ AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountServices: AccountService, 
    private router:Router){}

  canActivate(): boolean{
    if(this.accountServices.loggedIn()){
      return true;
    }
    else{
      this.router.navigateByUrl('/');
      return false;
    }
  }
  
}
