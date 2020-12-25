import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { UpdateProfileRequest } from '../_models/_userModels/UpdateProfileRequest';
import { Cities } from '../_services/cities';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  member: UpdateProfileRequest;
  updated: boolean;
  formsChanged:boolean;
  convertedGender: string;

  cities: Cities;
  citiesList: string[];

  @ViewChild('basicForm') basicForm;
  @ViewChild('aboutForm') aboutForm;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.member = new UpdateProfileRequest(); 
    this.cities = new Cities();
    this.citiesList = this.cities.list;
    this.member.Username = localStorage.getItem('un');
    this.getUserByUsername();

    this.updated = false;
    this.formsChanged = false;
    this.photoFound(); 

  }

  changeUpdatedStatus() {
    this.updated = !this.updated;
  }


  getUserByUsername(){
    this.accountService.getUserByUsername(this.member.Username).subscribe(user => {
      this.member.FirstName = user.firstName;
      this.member.LastName = user.lastName;
      this.member.Gender = user.gender;
      this.member.Location = user.location;
      this.member.About = user.about;
      this.member.Interests = user.interests;
      this.member.Password = user.password;

      this.transformGenderForFrontEnd();
    });



  }

  photoFound(){
    let url = localStorage.getItem('url');
    if(url !== 'null' && url !== '')
    {
      this.member.Url = url;
    }
    else
    {
      this.member.Url = 'assets/images/No_Image.png';
    }
  }

  transformGenderForBackend(){
    if(this.convertedGender === 'Female')
    {
      this.member.Gender = false;
    }
    else if(this.convertedGender === 'Male')
    {
      this.member.Gender = true;
    }

  }

  transformGenderForFrontEnd(){
    if(this.member.Gender === false){
      this.convertedGender = 'Female';
    }
    else if(this.member.Gender === true)
    {
      this.convertedGender = 'Male'
    }
  }

  updateProfile() {
    this.transformGenderForBackend();

    this.accountService.updateProfile(this.member).subscribe((item) => {
      this.formsChanged = false;
      this.changeUpdatedStatus();
      console.log(this.formsChanged);
      setTimeout(() => {
        this.changeUpdatedStatus();
      }, 4000);
    });
  }

  updateFormStatus(){
    this.formsChanged = true;
  }
}
