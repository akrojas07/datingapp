import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserResponse } from '../_models/_matchesModels/UserResponse';
import { GetNewMatchesRequest} from '../_models/_matchesModels/GetNewMatchesRequest';
import { MatchResponse} from '../_models/_matchesModels/MatchResponse';
import { UpsertMatchesRequest } from '../_models/_matchesModels/UpsertMatchesRequest';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  baseUrl = environment.matchesApiUrl;
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}



  getNewMatches(model: GetNewMatchesRequest): Observable<UserResponse[]>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    });
    return this.http.get<UserResponse[]>(this.baseUrl +'matches/newmatches/' + model.userId + '?Location='+ model.location, {headers});
    
  }

  getMatchByMatchId(matchId: number): Observable<MatchResponse>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    });

      return this.http.get<MatchResponse>(this.baseUrl+'matches/match/'+ matchId, {headers});
  }

  getMatchesByUserId(userId:number):Observable<MatchResponse[]>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    });
    return this.http.get<MatchResponse[]>(this.baseUrl+'matches/user/'+ userId, {headers});
  }

  upsertMatches(model:UpsertMatchesRequest[]){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    });
    let body = {UpsertMatches: model};
    return this.http.put(this.baseUrl+'matches', body,{headers});
  }
}
