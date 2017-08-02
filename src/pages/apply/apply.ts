import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Validator } from '../../interfaces/validator-interface'
import { User } from '../../interfaces/user-interface';

@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html',
})
export class ApplyPage {

  private validator: Validator = {} as Validator;
  private user: User = {} as User;
  private applied: boolean = false;
  private requirements: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.validator = navParams.get('validator');
    this.user = navParams.get('user');
    this.requirements = navParams.get('reqs');
    if (this.validator.appliedUsers) {
      for (let key of this.validator.appliedUsers) {
        if (this.user.$key == key)
          this.applied = true;
      }
    }

  }


  private apply() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyPage');
  }

}
