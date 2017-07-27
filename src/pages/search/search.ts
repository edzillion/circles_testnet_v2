import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FormBuilder, FormGroup, FormControl, Validators, } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';

import { UserDetailPage } from '../user-detail/user-detail';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  private searchTerm: string = '';
  private searchUsers$: Observable<User[]> | boolean;
  private searchControl: FormControl;

  private toUser: User;
  private user: User;
  private userSub$: Subscription;



  constructor(
    private navCtrl: NavController,
  private formBuilder: FormBuilder,
  private userService: UserService
) {
  }

  private setFilteredItems(): void {
  this.searchUsers$ = this.userService.filterUsers$(this.searchTerm);
}

private goToUserDetail(user): void {
  // go to the contact detail page
  // and pass in the user data
  this.navCtrl.push(UserDetailPage, user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

}
