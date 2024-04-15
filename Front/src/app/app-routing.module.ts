import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StadisticsComponent} from "./components/stadistics/stadistics.component";
import {RegisterComponent} from "./components/user/register/register.component";
import {LoginComponent} from "./components/user/login/login.component";
import {AddPublicationComponent} from "./components/publications/add-publication/add-publication.component";
import {ListPublicationsComponent} from "./components/publications/list-publications/list-publications.component";
import {ShowPublicationComponent} from "./components/publications/show-publication/show-publication.component";
import {authGuard, authGuardLogin} from "./guards/auth.guard";
import {TestComponent} from "./components/test/test.component";
import {ShowUserComponent} from "./components/user/show-user/show-user.component";
import {ListUsersComponent} from "./components/user/list-users/list-users.component";
import {ModUserComponent} from "./components/user/mod-user/mod-user.component";

const routes: Routes = [
  { path: 'uno', component: StadisticsComponent },
  { path: 'test', component: TestComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent, canDeactivate:[authGuardLogin] },
  { path: 'publicate', component: AddPublicationComponent, canActivate:[authGuard] },
  { path: 'explore', component: ListPublicationsComponent, canActivate:[authGuard] },
  { path: 'pub/:id', component: ShowPublicationComponent, canActivate:[authGuard] },
  { path: 'user/:id', component: ShowUserComponent, canActivate:[authGuard] },
  { path: 'users', component: ListUsersComponent, canActivate:[authGuard] },
  { path: 'edit', component: ModUserComponent, canActivate:[authGuard] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
