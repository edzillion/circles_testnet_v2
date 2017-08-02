import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../providers/user-service/user-service';
import { ValidatorService } from '../../providers/validator-service/validator-service'
import { User } from '../../interfaces/user-interface';
import { NewsItem } from '../../interfaces/news-item-interface';


@Component({
  selector: 'news-card',
  templateUrl: 'news-card.html'
})
export class NewsCard implements OnDestroy, OnInit {

  @Input('newsItem') newsItem: NewsItem;
  private user: User;
  private title: string;
  private message: string;
  private itemIcon: string;
  private subject: string;
  private profilePicURL: string = "https://firebasestorage.googleapis.com/v0/b/circles-testnet.appspot.com/o/profilepics%2Fgeneric-profile-pic.png?alt=media&token=d151cdb8-115f-483c-b701-e227d52399ef";
  private userSub$: Subscription;

  private toast: Toast;

  constructor(
    private toastCtrl: ToastController,
    private userService: UserService,
    private validatorService: ValidatorService
  ) { }

  ngOnInit() {
    this.userSub$ = this.userService.user$.subscribe(
      user => {
        this.user = user;
        if (this.user.profilePicURL) {
          this.profilePicURL = this.user.profilePicURL;
        }
      },
      error => {
        this.toast = this.toastCtrl.create({
          message: 'Error getting user: ' + error,
          duration: 3000,
          position: 'middle'
        });
        console.error(error);
        this.toast.present();
      },
      () => console.log('news-card ngOnInit userSub$ obs complete')
    );

    if (this.newsItem.type == 'createAccount') {
      this.title = "Account Creation";
      this.itemIcon = "add-circle";
      this.message = "Your Circles account was created!";
    }
    else if (this.newsItem.type == 'transaction' && this.newsItem.from == this.user.$key) {
      this.title = "Sent Circles";
      this.itemIcon = "arrow-dropright-circle";
      this.userService.keyToUser$(this.newsItem.to).take(1).subscribe(user => {
        if (user.profilePicURL) {
          this.profilePicURL = user.profilePicURL;
        }
        this.message = `${this.newsItem.amount} Circles to ${user.displayName}`;
      });
    }
    else if (this.newsItem.type == 'transaction' && this.user.$key == this.newsItem.to) {
      this.title = "Received Circles";
      this.itemIcon = "arrow-dropleft-circle";
      this.userService.keyToUser$(this.newsItem.from).take(1).subscribe(user => {
        if (user.profilePicURL) {
          this.profilePicURL = user.profilePicURL;
        }
        this.message = `${this.newsItem.amount} Circles from ${user.displayName}`;
      });
    }
    else if (this.newsItem.type == 'validatorRequest') {
      this.title = "Validator Request";
      this.itemIcon = "help-circle";
      this.validatorService.keyToValidator$(this.newsItem.from).take(1).subscribe(validator => {
        if (validator.profilePicURL) {
          this.profilePicURL = validator.profilePicURL;
        }
        this.message = `Requested validation from: ${validator.displayName}`;
      });
    }
    else if (this.newsItem.type == 'validatorAccept') {
      this.title = "Validator Accept";
      this.itemIcon = "checkmark-circle";
      this.validatorService.keyToValidator$(this.newsItem.from).take(1).subscribe(validator => {
        if (validator.profilePicURL) {
          this.profilePicURL = validator.profilePicURL;
        }
        this.message = `Validated by: ${validator.displayName}`;
      });
    }
    else if (this.newsItem.type == 'revokeValidator') {
      this.title = "Revoke Validation";
      this.itemIcon = "close-circle";
      this.validatorService.keyToValidator$(this.newsItem.to).take(1).subscribe(validator => {
        if (validator.profilePicURL) {
          this.profilePicURL = validator.profilePicURL;
        }
        this.message = `No longer validated by ${validator.displayName}`;
      });
    }
    else if (this.newsItem.type == 'trustUser') {
      this.title = "Trust Accept";
      this.itemIcon = "checkmark-circle";
      this.userService.keyToUser$(this.newsItem.to).take(1).subscribe(user => {
        if (user.profilePicURL) {
          this.profilePicURL = user.profilePicURL;
        }
        this.message = `Afforded trust to: ${user.displayName}`;
      });
    }
    else if (this.newsItem.type == 'revokeUser') {
      this.title = "Revoke Trust";
      this.itemIcon = "close-circle";
      this.userService.keyToUser$(this.newsItem.to).take(1).subscribe(user => {
        if (user.profilePicURL) {
          this.profilePicURL = user.profilePicURL;
        }
        this.message = `Stopped trusting: ${user.displayName}`;
      });
    }

  }
  ngOnDestroy() {
    this.userSub$.unsubscribe();
  }
}
