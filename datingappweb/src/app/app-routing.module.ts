import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { ChatsComponent } from './chats/chats.component';
import { HomeComponent } from './home/home.component';
import { MatchesComponent } from './matches/matches.component';
import { ProfileComponent } from './profile/profile.component';
import { MemberdetailComponent} from './matches/memberdetail/memberdetail.component';
import { AuthGuard } from '../app/_guards/auth.guard';


const routes: Routes = [
  {path: '', component: HomeComponent},

  {
    path: '',
    runGuardsAndResolvers: 'always', 
    canActivate: [AuthGuard],
    children:[
      {path: 'matches', component: MatchesComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'profile/:id', component: MemberdetailComponent},
      {path: 'chats', component: ChatsComponent},
      {path: 'chats/:id', component: ChatsComponent}
    ]
  },
  {path: '**', component: HomeComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
