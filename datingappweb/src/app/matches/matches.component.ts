import { Component, OnInit } from '@angular/core';
import { MatchResponse } from '../_models/_matchesModels/MatchResponse';
import { MatchesService } from '../_services/matches.service';
import { AccountService } from '../_services/account.service';
import { GetNewMatchesRequest } from '../_models/_matchesModels/GetNewMatchesRequest';
import { UserResponse } from '../_models/_matchesModels/UserResponse';
import { GetUsersByUserIdResponse } from '../_models/_userModels/GetUsersByUserIdResponse';
import { PhotoResponse } from '../_models/_matchesModels/PhotoResponse';
import { UpsertMatchesRequest } from '../_models/_matchesModels/UpsertMatchesRequest';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
})
export class MatchesComponent implements OnInit {
  matchRequest: GetNewMatchesRequest;
  existingMatches: MatchResponse[];
  newMatches: UserResponse[];
  existingMatchDetail: GetUsersByUserIdResponse[];
  upsertMatch: UpsertMatchesRequest;
  matchesList: UpsertMatchesRequest[];
  username: string;

  constructor(
    private matchService: MatchesService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.matchesList = [];
    this.existingMatches = [];
    this.newMatches = [];
    this.existingMatchDetail = [];
    this.matchRequest = new GetNewMatchesRequest();
    this.upsertMatch = new UpsertMatchesRequest();
    this.username = localStorage.getItem('un');
    this.getUserInformation();
  }

  getUserInformation() {
    this.accountService.getUserByUsername(this.username).subscribe((user) => {
      (this.matchRequest.userId = user.id),
      (this.matchRequest.location = user.location);
      this.getAllMatches();
    });
  }

  getNewMatchesByLocation() {
    this.matchService
      .getNewMatches(this.matchRequest)
      .subscribe((newPotentialMatches) => {
        newPotentialMatches.forEach((element) => {
          this.validatePhoto(element.photo);
          this.newMatches.push(element);
        });
      });
  }

  getExistingMatchesByUserId() {
    this.matchService
      .getMatchesByUserId(this.matchRequest.userId)
      .subscribe((items) => {
        items.forEach((element) => {
          this.existingMatches.push(element);
          this.getUserDetailsByUserId([
            element.firstUserId,
            element.secondUserId,
          ]);
        });
      });
  }

  getUserDetailsByUserId(userIds: number[]) {
    this.accountService.getUsersByUserId(userIds).subscribe((detail) => {
      detail.forEach((item) => {
        if (item.username !== this.username) {
          this.validatePhoto(item.photo);
          this.existingMatchDetail.push(item);
        }
      });
    });
  }

  getAllMatches() {
    this.getNewMatchesByLocation();
    this.getExistingMatchesByUserId();
  }

  removeMatches(index: number, type: string, liked: boolean){
    if(type === 'new')
    {
      this.newMatches.splice(index, 1);
    }
    if(type === 'existing' && liked === false)
    {
      this.existingMatches.splice(index, 1);
      this.existingMatchDetail.splice(index, 1);
    }
  }

  updateLike(response: boolean, index: number, matchedUserId: number, type:string) {
    this.upsertMatch = new UpsertMatchesRequest();

    this.upsertMatch.FirstUserId = this.matchRequest.userId; 
    this.upsertMatch.SecondUserId = matchedUserId; 
    this.upsertMatch.Liked = response;
    this.matchesList.push(this.upsertMatch);
    
    this.removeMatches(index, type, this.upsertMatch.Liked);

  }

  upsertMatches(model: UpsertMatchesRequest[]) {
    this.matchService.upsertMatches(model).subscribe((response) => {
      console.log(response);
    });
  }

  validatePhoto(photoInput: PhotoResponse) {
    if (
      photoInput.url !== null &&
      photoInput.url !== '' &&
      photoInput.url !== undefined
    ) {
      return photoInput.url;
    } else {
      photoInput.url = 'assets/images/No_Image.png';
      return photoInput.url;
    }
  }
}
