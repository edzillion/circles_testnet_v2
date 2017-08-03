import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FirebaseObjectObservable } from 'angularfire2/database';

import { UserService } from '../../providers/user-service/user-service';
import { NewsService } from '../../providers/news-service/news-service';
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
    public userService: UserService,
    public newsService: NewsService
  ) {
    this.userObssever = navParams.data.obs;
    this.auth = navParams.data.auth;
  }

  private agree() {
    //todo: problem here on relogin without refresh
    let user = this.userService.createUserRecord(this.auth);
    this.newsService.addCreateUser(user)
    this.userObssever.set({userData:user});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisclaimerPage');
  }

}
