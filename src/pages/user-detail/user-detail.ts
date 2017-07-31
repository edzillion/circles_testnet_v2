import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../providers/user-service/user-service';
import { NewsService } from '../../providers/news-service/news-service';
import { TransactionService } from '../../providers/transaction-service/transaction-service';
import { ValidatorService } from '../../providers/validator-service/validator-service';
import { User } from '../../interfaces/user-interface';
import { Validator } from '../../interfaces/validator-interface';

import { Subscription } from 'rxjs/Subscription';

import { SendPage } from '../send/send';

@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
})
export class UserDetailPage {

  private user: User;
  private viewUser: User;
  private userSub$: Subscription;
  private directTrust: boolean = false;
  private validatorTrust: boolean = false;
  private trusted: boolean = false;

  private validatedBy: any;

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    private newsService: NewsService,
    private transactionService: TransactionService,
    private validatorService: ValidatorService
  ) {
    this.viewUser = navParams.data;

    console.log(navParams.data);
  }

  private revokeTrust() {
    this.newsService.revokeTrust(this.viewUser);
    this.userService.revokeTrust(this.viewUser.$key);
  }

  private affordTrust() {
    this.newsService.addTrust(this.viewUser);
    this.newsService.addTrustRequest(this.viewUser);
    this.userService.applyForTrust(this.viewUser.$key);
  }

  private sendCircles () {
    this.navCtrl.push(SendPage, this.viewUser);
  }

  ionViewDidLoad() {
    this.userSub$ = this.userService.user$.subscribe(
      user => {
        this.user = user;
        let dTrust = this.user.trustedUsers.some(tUserKey => {
          return tUserKey == this.viewUser.$key;
        });
        if (dTrust) {
          this.directTrust = true;
          this.trusted = true;
        }
        else if (this.user.validators) {
          for (let vKey of this.user.validators) {
            let v = this.validatorService.validators[vKey] as Validator;
            for (let tUserKey of v.trustedUsers) {
              if (tUserKey == this.viewUser.$key) {
                this.validatorTrust = true;
                this.validatedBy = v;
                this.trusted = true;
              }
            }
          }
        }
      }
    );
  }
}
