import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotificationsService, SimpleNotificationsComponent  } from 'angular2-notifications';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private notificationsService: NotificationsService,) {
  }

  ionViewDidLoad() {
    this.notificationsService.create('Load Success','','success');
  }

}
