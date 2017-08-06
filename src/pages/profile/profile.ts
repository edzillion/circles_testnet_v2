import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams, Toast, ToastController } from 'ionic-angular';
import { NotificationsService, SimpleNotificationsComponent  } from 'angular2-notifications';

import { DomSanitizer } from '@angular/platform-browser';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../providers/user-service/user-service';
import { NewsService } from '../../providers/news-service/news-service';
import { ValidatorService } from '../../providers/validator-service/validator-service';
import { StorageService } from '../../providers/storage-service/storage-service';
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
  public dataURI: any;
  private profilePicURL: any;

  private userSub$: Subscription;
  private providers: Array<any>;
  private user: User = {} as User;

  private loading: Loading;
  private fileSelected: any;

  constructor(
    private db: AngularFireDatabase,
    private ds: DomSanitizer,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private storageService: StorageService,
    private toastCtrl: ToastController,
    private userService: UserService,
    private validatorService: ValidatorService
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



  public fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (e) => {
        this.profilePicURL = e.target['result'];
        var img = new Image;
        img.src = e.target['result'];
        img.onload = (() => {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');

          // We set the dimensions at the wanted size.
          canvas.width = 600;
          canvas.height = 800;

          // We resize the image with the canvas method drawImage();
          ctx.drawImage(img, 0, 0, 600, 800);

          let resize = canvas.toDataURL('image/jpeg', 0.7);
          this.dataURI = resize.substring(23);
          // continue from here...
        });

        this.base64ImageData = this.profilePicURL.substring(22);
      }

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  private fileUpload() {

    this.loading = this.loadingCtrl.create({
      content: 'Uploading ...',
      //dismissOnPageChange: true
    });
    // let storageRef = firebase.storage().ref('/profilepics');
    // let c = storageRef.child(this.user.uid);
    // let uploadTask = c.putString(this.dataURI, 'base64', { contentType: 'image/jpg' });

    this.storageService.resizeAndUploadProfilePic(this.dataURI).then( res => {debugger;});
    //   let snap = snapshot as any;
    //   //Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //   var progress = (snap.bytesTransferred / snap.totalBytes) * 100;
    //   console.log('Upload is ' + progress + '% done');
    //   switch (snap.state) {
    //     case firebase.storage.TaskState.PAUSED: // or 'paused'
    //       console.log('Upload is paused');
    //       break;
    //     case firebase.storage.TaskState.RUNNING: // or 'running'
    //       console.log('Upload is running');
    //       break;
    //   }
    //
    // })
    //
    // uploadTask.on(
    //   firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    //   function(snapshot) {
    //     let snap = snapshot as any;
    //     //Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //     var progress = (snap.bytesTransferred / snap.totalBytes) * 100;
    //     console.log('Upload is ' + progress + '% done');
    //     switch (snap.state) {
    //       case firebase.storage.TaskState.PAUSED: // or 'paused'
    //         console.log('Upload is paused');
    //         break;
    //       case firebase.storage.TaskState.RUNNING: // or 'running'
    //         console.log('Upload is running');
    //         break;
    //     }
    //   },
    //   function(error) {
    //     this.toast = this.toastCtrl.create({
    //       message: 'Error uploading image: ' + error,
    //       duration: 1500,
    //       position: 'middle'
    //     });
    //     console.error(error);
    //     this.toast.present();
    //   });
    //
    // uploadTask.then((obj) => {
    //   this.user.profilePicURL = uploadTask.snapshot.downloadURL;
    //   this.user.authProviders.push('photo');
    //
    //   this.userService.updateUser({ authProviders: this.user.authProviders, profilePicURL: this.user.profilePicURL })
    //     .then((success) => {
    //
    //       console.log('userData save success');
    //
    //     })
    //     .catch(
    //     error => {
    //       this.loading.dismiss();
    //       this.toast = this.toastCtrl.create({
    //         message: 'Error saving user: ' + error,
    //         duration: 1500,
    //         position: 'middle'
    //       });
    //       console.error(error);
    //       this.toast.present();
    //     },
    //   ),
    //     () => { this.loading.dismiss(); };
    // });
  }

  private saveProfile() {
    // this.user.displayName = this.user.firstName + ' ' + this.user.lastName;
    // this.userService.saveUser();
    // this.navCtrl.pop();
  }

}
