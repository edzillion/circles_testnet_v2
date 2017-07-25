import { Component } from '@angular/core';
import { Nav, NavController, NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

    // private user: User;
    // private userSub$: Subscription;

    //private toast: Toast

    private tab1Root = HomePage;
    private tab2Root = AboutPage;
    private tab3Root = ContactPage;

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
