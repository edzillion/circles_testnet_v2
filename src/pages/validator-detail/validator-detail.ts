import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../providers/user-service/user-service';
import { NewsService } from '../../providers/news-service/news-service';
import { User } from '../../interfaces/user-interface';

import { ApplyPage } from '../../pages/apply/apply';

import { Validator } from '../../interfaces/validator-interface';
import { ValidatorService } from '../../providers/validator-service/validator-service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-validator-detail',
  templateUrl: 'validator-detail.html',
})
export class ValidatorDetailPage {

  private user: User;
  private validator: Validator = {} as Validator;
  private userSub$: Subscription;
  private trusted: boolean = false;
  private applied: boolean = false;

  private trustedUsers: Array<User>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    private newsService: NewsService,
    private validatorService: ValidatorService
  ) {
    this.validator = navParams.data;
  }

  private revokeTrust() {
    this.validator.trustedUsers.filter(
      user => user !== this.user.$key
    );
    this.trusted = false;
    this.newsService.revokeValidatorTrust(this.validator);
  }

  private checkRequirements() {
    this.navCtrl.push(ApplyPage, {validator:this.validator, user:this.user});
  }

  ionViewDidLoad() {
    this.userSub$ = this.userService.user$.subscribe(
      user => {
        this.user = user;
        this.trustedUsers = [];
        if (this.user.validators) {
          for (let vKey of this.user.validators) {
            let v = this.validatorService.validators[vKey] as Validator;
            if (v.trustedUsers) {
              for (let tUserKey of v.trustedUsers) {
                let u = this.userService.users[tUserKey];
                this.trustedUsers.push(u);
                if (tUserKey == this.validator.$key) {
                  this.trusted = true;
                }
              }
            }
          }
        }
        if (this.validator.appliedUsers) {
          if (this.validator.appliedUsers.find(u => u === this.user.$key)) {
            this.applied = true;
          }
        }
      }
    );
  }

}
