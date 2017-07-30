import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FirebaseObjectObservable } from 'angularfire2/database';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';

@Component({
  selector: 'page-disclaimer',
  templateUrl: 'disclaimer.html',
})
export class DisclaimerPage {

  userObssever: FirebaseObjectObservable<User>;
  auth: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) {
    this.userObssever = navParams.data.obs;
    this.auth = navParams.data.auth;
  }

  private agree() {
    let u = this.userService.createUserRecord(this.auth);
    debugger;
    this.userObssever.set(u);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisclaimerPage');
  }

}
