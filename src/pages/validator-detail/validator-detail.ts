import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';

import { Validator } from '../../interfaces/validator-interface';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-validator-detail',
  templateUrl: 'validator-detail.html',
})
export class ValidatorDetailPage {

  private user: User;
  private validator: Validator;
  private userSub$: Subscription;
  private trusted: boolean = false;

  private trustedUsers: Array<User>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
    this.validator = navParams.data;
  }

  private revokeTrust() {
    this.validator.trustedUsers.filter(
      user => user !== this.user.$key
    );
    this.trusted = false;
  }

  private affordTrust() {
    //this.userService.addTrustedUser(this.viewUser.$key);
    if (this.validator.trustedUsers)
      this.validator.trustedUsers.push(this.user.$key);
    else
      this.validator.trustedUsers = [this.user.$key];
    this.trusted = true;
  }

  ionViewDidLoad() {
    this.userSub$ = this.userService.initUserSubject$.subscribe(
      user => {
        this.user = user;
        if (this.user.validators) {
          for (var validator of this.user.validators) {
            for (var tUserKey of validator.trustedUsers) {
              let u = this.userService.users[tUserKey];
              this.trustedUsers.push(u);
              if (tUserKey == this.validator.$key)
                this.trusted = true;
            }
          }
        }
      }
    );
  }

}
