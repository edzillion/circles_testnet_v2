import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams, Toast, ToastController } from 'ionic-angular';
import { NotificationsService, SimpleNotificationsComponent  } from 'angular2-notifications';

import { DomSanitizer } from '@angular/platform-browser';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../providers/user-service/user-service';
import { NewsService } from '../../providers/news-service/news-service';
import { ValidatorService } from '../../providers/validator-service/validator-service';
import { StorageService, UploadImage } from '../../providers/storage-service/storage-service';
import { User } from '../../interfaces/user-interface';
import { Individual  } from '../../interfaces/individual-interface';

import { SearchPage } from '../search/search';
import { UserDetailPage } from '../user-detail/user-detail';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private toast: Toast;
  private base64ImageData: string;
  private profilePicURL: any;

  private userSub$: Subscription;
  private providers: Array<any>;
  private user: User = {} as User;

  private loading: Loading;
  private fileSelected: any;
  private profilePicUpload: UploadImage;

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
        this.providers = this.validatorService.userProviders;
      }
    );
  }

  public fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {

      var reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicURL = e.target['result'];
        this.base64ImageData = this.profilePicURL.substring(23);
      }
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  private fileUpload() {

    this.loading = this.loadingCtrl.create({
      content: 'Uploading ...',
      //dismissOnPageChange: true
    });

    if (this.base64ImageData) {
      this.profilePicUpload = new UploadImage(this.profilePicURL);
      this.profilePicUpload.owner = this.user.uid;

      let progressIntervalObs$ = Observable.interval(200).subscribe( () => {
        this.profilePicUpload.progress++;
        this.loading.data.content = this.sanitizer.bypassSecurityTrustHtml(
          '<p>Saving Profile ...</p><progress value="'+this.profilePicUpload.progress+'" max="100"></progress>'
        )
      });

      this.storageService.resizeAndUploadProfilePic(this.profilePicUpload).then(
        (profileURL) => {
          this.user.profilePicURL = profileURL;
          progressIntervalObs$.unsubscribe();
          this.userService.updateUser({profilePicURL:this.user.profilePicURL});
        },
        (error) => {
          progressIntervalObs$.unsubscribe();
          this.toast = this.toastCtrl.create({
            message: error.message + ': ' + error.details,
            duration: 2500,
            position: 'middle'
          });
          console.error(error);
          this.toast.present();
        }
      );
    }
  }

  private saveProfile() {
    if (this.userService.type == 'individual') {
      let u = this.user as Individual;
      this.user.displayName = u.firstName + ' ' + u.lastName;
    }
    else {

    }
    this.userService.saveUser();
    this.navCtrl.pop();
  }

}
