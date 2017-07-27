import { Component } from '@angular/core';
import { NavController, NavParams, Toast, ToastController } from 'ionic-angular';
import { NotificationsService, SimpleNotificationsComponent  } from 'angular2-notifications';

import { DomSanitizer } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';

import { SearchPage } from '../search/search';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

    private toast: Toast;
    private base64ImageData: string;
    public profilePicURL: string = "https://firebasestorage.googleapis.com/v0/b/circles-testnet.appspot.com/o/profilepics%2Fgeneric-profile-pic.png?alt=media&token=d151cdb8-115f-483c-b701-e227d52399ef";

    private user: User;
    private userSub$: Subscription;

      private selectedView: string = 'network';

      private viewList: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private notificationsService: NotificationsService,
    private camera: Camera,
    private db: AngularFireDatabase,
    private ds: DomSanitizer,
    private toastCtrl: ToastController,
    private userService: UserService
  ) {
  }

  private openSearch(): void {
    this.navCtrl.push(SearchPage);
  }

  private selectNetwork():void {
  this.selectedView = 'network';
}

private selectHistory():void {
  this.selectedView = 'history';
}

private selectValidators():void {
  this.selectedView = 'validators';
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

  ionViewDidLoad() {
    this.notificationsService.create('Load Success','','success');
    this.userSub$ = this.userService.initUserSubject$.subscribe(
      user => {
        debugger;
        user.trustedUsers.map(

          key => {
            debugger;
            this.userService.keyToUser$(key).subscribe( trustedUser => { this.viewList.push(trustedUser)})
          }
        );
        this.user = user
      }
    );
  }

}
