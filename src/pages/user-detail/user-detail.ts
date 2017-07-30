import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../providers/user-service/user-service';
import { TransactionService } from '../../providers/transaction-service/transaction-service';
import { User } from '../../interfaces/user-interface';

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
    private transactionService: TransactionService
  ) {
    this.viewUser = navParams.data;

    console.log(navParams.data);
  }

  private revokeTrust() {
    this.userService.revokeTrust(this.viewUser.$key);
  }

  private affordTrust() {
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
          for (var validator of this.user.validators) {
            for (var tUserKey of validator.trustedUsers) {
              if (tUserKey == this.viewUser.$key)
                this.validatorTrust = true;
                this.validatedBy = validator;
                this.trusted = true;
            }
          }
        }
      }
    );
  }
}
