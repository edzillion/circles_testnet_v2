import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-search-detail',
  templateUrl: 'search-detail.html',
})
export class SearchDetailPage {

  private user: User;
  private viewUser: User;
  private userSub$: Subscription;
  private trusted: boolean = false;

  constructor(private navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
    this.viewUser = navParams.data;

    console.log(navParams.data);
  }

  ionViewDidLoad() {
    this.userSub$ = this.userService.initUserSubject$.subscribe(
      user => {
        this.user = user;
        if (this.user.trustedUsers.some(user => user.$key === this.user.$key)) {
          this.trusted = true;
        }
      }
    );
  }

}
