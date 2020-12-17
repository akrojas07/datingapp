import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { UpdateProfileRequest } from '../_models/_userModels/UpdateProfileRequest';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  member: UpdateProfileRequest; 
  username: string;

  @ViewChild('basicForm') basicForm;


  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.username = localStorage.getItem('un');

    this.member = new UpdateProfileRequest(); 
    this.member.FirstName = localStorage.getItem('fn');
    this.member.LastName = localStorage.getItem('ln');
  }

  updateProfile(){
    console.log(this.member.Password);
    this.accountService.updateProfile(this.member).subscribe(
      updatedUser =>{
        console.log(updatedUser);
      }
    );
  }
}
