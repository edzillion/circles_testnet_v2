import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  //vars
  private base64ImageData: string;
  public profilePicURL: string = "https://firebasestorage.googleapis.com/v0/b/circles-testnet.appspot.com/o/profilepics%2Fgeneric-profile-pic.png?alt=media&token=d151cdb8-115f-483c-b701-e227d52399ef";
  private user: User;
  private userSub$: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
  }
    

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  
    //load user data
    this.userSub$ = this.userService.initUserSubject$.subscribe(
      user => {
        this.user = user;
        console.log("user", user);
      }
    );

  }

  settings = {}

  logForm() {
    console.log(this.settings)
  }

}
