import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../../_services/account.service';
import { GetUserDetailResponse } from '../.././_models/_matchesModels/memberDetailModels/GetUserDetailResponse';
import { GetUsersByUserIdResponse } from 'src/app/_models/_userModels/GetUsersByUserIdResponse';
import { PhotoResponse } from 'src/app/_models/_matchesModels/PhotoResponse';

@Component({
  selector: 'app-memberdetail',
  templateUrl: './memberdetail.component.html',
  styleUrls: ['./memberdetail.component.scss']
})
export class MemberdetailComponent implements OnInit {
  matchedUserId: number; 
  matchedMemberDetail: GetUserDetailResponse; 
  memberGender: string;

  constructor(private accountService: AccountService,
    private activatedRoute: ActivatedRoute) 
    { 
      this.matchedUserId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    }

  ngOnInit() {
    this.matchedMemberDetail = new GetUserDetailResponse(); 
    this.matchedMemberDetail.photo = new PhotoResponse();
    if(this.matchedUserId > 0)
    {
      this.getUserDetailByUserId();
    }


  }

  getUserDetailByUserId(){
    this.accountService.getUsersByUserId([this.matchedUserId])
    .subscribe(response =>{
      this.setPhoto(response[0].photo);
      this.matchedMemberDetail.id = response[0].id;
      this.matchedMemberDetail.firstName = response[0].firstName;
      this.matchedMemberDetail.lastName  = response[0].lastName;
      this.matchedMemberDetail.location = response[0].location;
      this.matchedMemberDetail.interests = response[0].interests;
      this.matchedMemberDetail.about = response[0].about;
      this.transformGenderForFrontEnd(); 

    });
  }

  setPhoto(photo: PhotoResponse){
    if(photo != null && photo.url !== null && photo.url !== '' && photo.url !== undefined )
    {
      this.matchedMemberDetail.photo.url = photo.url;

    }
    else
    {
      this.matchedMemberDetail.photo.url = 'assets/images/No_Image.png';
    }
    return this.matchedMemberDetail.photo.url; 
  }

  transformGenderForFrontEnd(){
    if(this.matchedMemberDetail.gender==false)
    {
      this.memberGender = 'Female'
    }
    else{
      this.memberGender = 'Male'
    }
  }
}
