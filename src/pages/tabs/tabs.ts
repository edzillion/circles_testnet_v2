import { Component } from '@angular/core';
import { Nav, NavController, NavParams } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { SearchPage } from '../search/search';
import { LogPage } from '../log/log';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

    // private user: User;
    // private userSub$: Subscription;

    //private toast: Toast

    private tab1Root = ProfilePage;
    private tab2Root = SearchPage;
    private tab3Root = LogPage;

    private nav: Nav;

    private pageTitle: string = "Home";

    constructor(
      private navParams: NavParams
    ) {

      this.nav = this.navParams.get('nav');
    }

    private onTabSelect(event: any):void {
      this.pageTitle = event.id;
    }

    // ionViewDidLoad() {
    //
    //   this.userSub$ = this.userService.user$.subscribe(
    //     user => this.user = user,
    //     error => {
    //       this.toast = this.toastCtrl.create({
    //         message: 'Error getting user: '+error,
    //         duration: 3000,
    //         position: 'middle'
    //       });
    //       console.error(error);
    //       this.toast.present();
    //     },
    //     () => console.log('tab ionViewDidLoad userSub$ obs complete')
    //   );
    // }
    //
    // ionViewWillUnload () {
    //   this.userSub$.unsubscribe();
    // }

  }
