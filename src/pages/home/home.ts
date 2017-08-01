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
import { ValidatorDetailPage } from '../validator-detail/validator-detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  private toast: Toast;
  private base64ImageData: string;
  public profilePicURL: string = "https://firebasestorage.googleapis.com/v0/b/circles-testnet.appspot.com/o/profilepics%2Fgeneric-profile-pic.png?alt=media&token=d151cdb8-115f-483c-b701-e227d52399ef";

  private user: User;
  private userSub$: Subscription;

  private selectedView: string = 'network';
  private view: string = 'network';

  private networkList: Array<any> = [];
  private newsList: Array<any> = [];
  private validatorList: Array<any> = [];

  private myCoinBalance: number;
  private allCoinBalance: number;
  private myCoinName: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, private notificationsService: NotificationsService,
    private camera: Camera,
    private db: AngularFireDatabase,
    private ds: DomSanitizer,
    private toastCtrl: ToastController,
    private userService: UserService,
    private newsService: NewsService,
    private validatorService: ValidatorService
  ) { }

  private openSearch(): void {
    this.navCtrl.push(SearchPage);
  }

  private goToUserDetail(user): void {
    this.navCtrl.push(UserDetailPage, user);
  }

  private goToValidatorDetail(validator): void {
    this.navCtrl.push(ValidatorDetailPage, validator);
  }

  private selectNetwork(): void {
    this.selectedView = 'network';
  }

  private selectNews(): void {
    this.selectedView = 'news';
  //this.newsService.allnewsItemsReversed$.subscribe( ns => {debugger});
  }

  private selectValidators(): void {
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
    this.userSub$ = this.userService.user$.subscribe(
      user => {
        this.networkList = [];
        this.validatorList = [];
        this.user = user;
        this.myCoinName = this.user.wallet[this.user.$key].title;
        this.myCoinBalance = this.user.wallet[this.user.$key].amount;
        this.allCoinBalance = this.user.balance;

        if (user.trustedUsers) {
          user.trustedUsers.map(
            key => {
              if (this.user.$key == key) {
                return;
              }
              this.userService.keyToUser$(key).subscribe(
                trustedUser => { this.networkList.push(trustedUser) }
              )
            }
          );
        }
        if (this.user.validators) {
          this.validatorService.validators$.subscribe(
            valis => {
              for (let vKey of this.user.validators) {
                let v = valis[vKey];
                this.validatorList.push(v);
              }
            }
          );
        }
      }
    );
  }

}
