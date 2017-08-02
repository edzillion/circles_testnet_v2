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
import { ValidatorService } from '../../providers/validator-service/validator-service';
import { User } from '../../interfaces/user-interface';

import { SearchPage } from '../search/search';
import { UserDetailPage } from '../user-detail/user-detail';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private toast: Toast;
  private base64ImageData: string;
  public profilePicURL: string = "https://firebasestorage.googleapis.com/v0/b/circles-testnet.appspot.com/o/profilepics%2Fgeneric-profile-pic.png?alt=media&token=d151cdb8-115f-483c-b701-e227d52399ef";

  private userSub$: Subscription;
  private providers: Array<any>;
  private user: User = {} as User;

  private fileSelected: any;

  constructor(
    private navCtrl: NavController,
    private camera: Camera,
    private db: AngularFireDatabase,
    private ds: DomSanitizer,
    private toastCtrl: ToastController,
    private userService: UserService,
    private validatorService: ValidatorService,
    private sanitizer:DomSanitizer
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    this.userSub$ = this.userService.user$.subscribe(
      user => {
        this.user = user;
        if (this.user.profilePicURL) {
          this.profilePicURL = this.user.profilePicURL;
        }
        this.providers = this.validatorService.getUserProviders(user);
      }
    );
  }

  private isUploadSupported() {
    if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
        return false;
    }
    var elem = document.createElement('input');
    elem.type = 'file';
    return !elem.disabled;
  }

  public fileChangeEvent(fileInput: any){
      if (fileInput.target.files && fileInput.target.files[0]) {
        var reader = new FileReader();

        reader.onload = (e) => {
            this.base64ImageData = e.target['result'];
            this.profilePicURL = this.base64ImageData;
        }

        reader.readAsDataURL(fileInput.target.files[0]);
    }
}

  private fileUpload() {
    debugger;
    let uploadTask = firebase.storage().ref('/profilepics').child(this.user.uid).putString(this.base64ImageData, 'base64', { contentType: 'image/jpg' });

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        debugger;
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        // switch (snapshot.state) {
        //   case firebase.storage.TaskState.PAUSED: // or 'paused'
        //     console.log('Upload is paused');
        //     break;
        //   case firebase.storage.TaskState.RUNNING: // or 'running'
        //     console.log('Upload is running');
        //     break;
        // }
      },
      function(error) {
        this.toast = this.toastCtrl.create({
          message: 'Error uploading image: ' + error,
          duration: 3000,
          position: 'middle'
        });
        console.error(error);
        this.toast.present();
      });
      //,
      // function() {
      //   // Upload completed successfully, now we can get the download URL
      //   console.log('Upload Complete');
      // });

    // uploadTask.then((obj) => {
    //   this.user.profilePicURL = uploadTask.snapshot.downloadURL;
    //
    //   this.db.object(`users/${this.UID}`).set(this.user)
    //     .then((success) => {
    //
    //       console.log('userData save success');
    //       this.pushService.initialise().then( () => {
    //         console.log('pushService initialised');
    //         this.formState.loading.dismiss();
    //         if (this.formState.refilling)
    //           this.navCtrl.setRoot(TabsPage);
    //       });
    //     })
    //     .catch(
    //     error => {
    //       this.toast = this.toastCtrl.create({
    //         message: 'Error saving user: ' + error,
    //         duration: 3000,
    //         position: 'middle'
    //       });
    //       console.error(error);
    //       this.toast.present();
    //     });
    // });
  }

  private saveProfile() {
    this.user.displayName = this.user.firstName + ' ' + this.user.lastName;
    this.userService.saveUser();
    this.navCtrl.pop();
  }

}
