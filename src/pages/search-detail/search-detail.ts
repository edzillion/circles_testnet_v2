import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SearchDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-detail',
  templateUrl: 'search-detail.html',
})
export class SearchDetailPage {
  user: any;

  constructor(private navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.data;
    console.log(navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchDetailPage');
  }

}
