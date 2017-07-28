import { Component } from '@angular/core';
import { NavController, NavParams, Toast, ToastController } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../providers/user-service/user-service';
import { WalletService } from '../../providers/wallet-service/wallet-service';
import { User } from '../../interfaces/user-interface';

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  private user: User;
  private userSub$: Subscription;
  private toast: Toast;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    private toastCtrl: ToastController,
    private walletService: WalletService
  )
  { }

  ionViewDidLoad() {

    console.log('ionViewDidLoad WalletPage');

    this.userSub$ = this.userService.user$.subscribe(
      user => this.user = user,
      error => {
        this.toast = this.toastCtrl.create({
          message: 'Error getting user: '+error,
          duration: 3000,
          position: 'middle'
        });
        console.error(error);
        this.toast.present();
      },
      () => console.log('send ionViewDidLoad userSub$ obs complete')
    );
  }

}
