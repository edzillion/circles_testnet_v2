import { Component, ViewChild } from '@angular/core';
import { AlertController, Loading, LoadingController, Events, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../providers/user-service/user-service';

import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';

import { WalletPage } from '../pages/wallet/wallet';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  @ViewChild('content') nav;

private loading: Loading;

private initSub$: Subscription;

  constructor(
    private alertController: AlertController,
    private userService: UserService,
    public events: Events,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    //aprivate analytics: AnalyticsService,
    private loadingCtrl: LoadingController
  ) {
    platform.ready()      .then(() => {

      if (this.platform.is('cordova')) {

      }
      statusBar.styleDefault();
      this.userService.authState$.subscribe(
        auth => {
          if (auth)
            this.nav.setRoot(ProfilePage, { nav: this.nav })
          else {}
            //todo: error here
        },
        error => console.error(error),
        () => { }
      );

    });
  }

  private goToWallet() : void {
    this.nav.push(WalletPage);
  }

  private goToSettings() : void {
    this.nav.push(SettingsPage);
  }

  private logout() : void {
  //close subscriptions?? close services??
  this.userService.signOut().then(
    (user) => {
    console.log('logout success');

    this.nav.setRoot(LoginPage);
  }, function(error) {
    console.log('logout fail:', error);
  });

  }
}
