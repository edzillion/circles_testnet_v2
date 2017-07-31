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

  private toast: Toast;
  private base64ImageData: string;
  public profilePicURL: string = "https://firebasestorage.googleapis.com/v0/b/circles-testnet.appspot.com/o/profilepics%2Fgeneric-profile-pic.png?alt=media&token=d151cdb8-115f-483c-b701-e227d52399ef";

  private userSub$: Subscription;
  private providers$: Subscription;
  private allProviders: Array<any>;
  private userProviders: Array<boolean>;
  private user: User = {} as User;

  constructor(
    private camera: Camera,
    private db: AngularFireDatabase,
    private ds: DomSanitizer,
    private toastCtrl: ToastController,
    private userService: UserService
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    this.userSub$ = this.userService.user$.subscribe(
      user => {
        this.user = user;
        this.db.list('/static/authProviders/').subscribe(
          provs => {
            this.allProviders = [];
            this.userProviders = [];
            for (let p of user.authProviders) {
              this.userProviders[p] = true;
            }
            for (let p2 of provs) {
              if (this.userProviders[p2.$key]) {
                p2.completed = true;
              }
              this.allProviders.push(p2);
            }
          }
        );
      }
    );
  }

  private selectFromGallery(): void {
    var options = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL
    };
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is a base64 encoded string
        this.base64ImageData = imageData;
        this.profilePicURL = "data:image/jpeg;base64," + imageData;
      },
      error => {
        this.toast = this.toastCtrl.create({
          message: 'Error selecting from gallery: ' + error,
          duration: 3000,
          position: 'middle'
        });
        console.error(error);
        this.toast.present();
      });
  }

  private openCamera(): void {
    var options = {
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL
    };
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is a base64 encoded string
        this.base64ImageData = imageData;
        this.profilePicURL = "data:image/jpeg;base64," + imageData;
      },
      error => {
        this.toast = this.toastCtrl.create({
          message: 'Error opening camera: ' + error,
          duration: 3000,
          position: 'middle'
        });
        console.error(error);
        this.toast.present();
      });
  }

  saveProfile() {
    debugger;
    this.db.object('/users/'+this.user.$key).set(this.user);
  }

}
