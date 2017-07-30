import { Component } from '@angular/core';
import { NavController, NavParams, Toast, ToastController } from 'ionic-angular';
import { NotificationsService, SimpleNotificationsComponent  } from 'angular2-notifications';

import { DomSanitizer } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../providers/user-service/user-service';
import { NewsService } from '../../providers/news-service/news-service';
import { User } from '../../interfaces/user-interface';

import { SearchPage } from '../search/search';
import { UserDetailPage } from '../user-detail/user-detail';
import { ValidatorDetailPage } from '../validator-detail/validator-detail';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

    //vars
    private base64ImageData: string;
    public profilePicURL: string = "https://firebasestorage.googleapis.com/v0/b/circles-testnet.appspot.com/o/profilepics%2Fgeneric-profile-pic.png?alt=media&token=d151cdb8-115f-483c-b701-e227d52399ef";
    private user: User;
    private userSub$: Subscription;

    constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
    }


    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfilePage');

      //load user data
      this.userSub$ = this.userService.initUserSubject$.subscribe(
        user => {
          this.user = user;
          console.log("user", user);
        }
      );

    }

    saveProfile() {

    }

  }
