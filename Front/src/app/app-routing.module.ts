import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StadisticsComponent} from "./components/stadistics/stadistics.component";
import {RegisterComponent} from "./components/user/register/register.component";
import {LoginComponent} from "./components/user/login/login.component";
import {AddPublicationComponent} from "./components/publications/add-publication/add-publication.component";
import {ListPublicationsComponent} from "./components/publications/list-publications/list-publications.component";
import {ShowPublicationComponent} from "./components/publications/show-publication/show-publication.component";
import {authGuard, authGuardLogin, authGuardSubmit} from "./guards/auth.guard";
import {TestComponent} from "./components/test/test.component";
import {ShowUserComponent} from "./components/user/show-user/show-user.component";
import {ListUsersComponent} from "./components/user/list-users/list-users.component";
import {ModUserComponent} from "./components/user/mod-user/mod-user.component";
import {ModPublicationComponent} from "./components/publications/mod-publication/mod-publication.component";
import {UserStadisticsComponent} from "./components/stadistics/user-stadistics/user-stadistics.component";
import {PubStadisticsComponent} from "./components/stadistics/pub-stadistics/pub-stadistics.component";
import {HomeComponent} from "./components/home/home.component";
import {ListPurchasesComponent} from "./components/purchases/list-purchases/list-purchases.component";
import {ListSellsComponent} from "./components/sells/list-sells/list-sells.component";
import {ListDeliveriesComponent} from "./components/deliveries/list-deliveries/list-deliveries.component";
import {SellStadisticsComponent} from "./components/stadistics/sell-stadistics/sell-stadistics.component";
import {CartComponent} from "./components/cart/cart.component";
import {
  ListPublicationsMineComponent
} from "./components/publications/list-publications-mine/list-publications-mine.component";
import {ResetPasswordComponent} from "./components/user/reset-password/reset-password.component";
import {TermsComponent} from "./components/more/terms/terms.component";
import {AnswersComponent} from "./components/more/answers/answers.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' }, // redirect to `first-component`
  //test
  { path: 'uno', component: StadisticsComponent },
  { path: 'test', component: TestComponent },
  //components
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'pass', component: ResetPasswordComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'answers', component: AnswersComponent },
  { path: 'publicate', component: AddPublicationComponent, canActivate:[authGuard], canDeactivate:[authGuardSubmit] },
  { path: 'explore', component: ListPublicationsComponent, canActivate:[authGuard] },
  { path: 'mypubs', component: ListPublicationsMineComponent, canActivate:[authGuard] },
  { path: 'pub/:id', component: ShowPublicationComponent, canActivate:[authGuard] },
  { path: 'editpub/:id', component: ModPublicationComponent, canActivate:[authGuard] },
  { path: 'user/:id', component: ShowUserComponent, canActivate:[authGuard] },
  { path: 'users', component: ListUsersComponent, canActivate:[authGuard] },
  { path: 'edit', component: ModUserComponent, canActivate:[authGuard], canDeactivate:[authGuardSubmit] },
  { path: 'cart', component: CartComponent, canActivate:[authGuard] },
  { path: 'purchases', component: ListPurchasesComponent, canActivate:[authGuard] },
  { path: 'sells', component: ListSellsComponent, canActivate:[authGuard] },
  { path: 'deliveries', component: ListDeliveriesComponent, canActivate:[authGuard] },
  { path: 'stats/users', component: UserStadisticsComponent, canActivate:[authGuard] },
  { path: 'stats/pubs', component: PubStadisticsComponent, canActivate:[authGuard] },
  { path: 'stats/sells', component: SellStadisticsComponent, canActivate:[authGuard] },
  //redirect
  { path: '**', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
