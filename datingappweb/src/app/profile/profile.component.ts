import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { UpdateProfileRequest } from '../_models/_userModels/UpdateProfileRequest';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  member: UpdateProfileRequest;
  updated: boolean;

  @ViewChild('basicForm') basicForm;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.member = new UpdateProfileRequest();
    this.member.Username = localStorage.getItem('un');
    this.member.FirstName = localStorage.getItem('fn');
    this.member.LastName = localStorage.getItem('ln');

    this.updated = false;
    this.photoFound(); 
  }

  changeUpdatedStatus() {
    this.updated = !this.updated;
  }

  photoFound(){
    let url = localStorage.getItem('url');
    console.log(typeof(url));
    if(url !== 'null' && url !== '')
    {
      this.member.Url = url;
    }
    else
    {
      this.member.Url = 'assets/images/No_Image.png';
    }
  }

  updateProfile() {
    this.basicForm.control.markAsPristine();
    this.accountService.updateProfile(this.member).subscribe((item) => {
      this.changeUpdatedStatus();
      setTimeout(() => {
        this.changeUpdatedStatus();
      }, 4000);
    });
  }
}
