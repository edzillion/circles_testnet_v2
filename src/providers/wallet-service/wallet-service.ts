import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Subscription } from 'rxjs/Subscription';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';
import { Coin } from '../../interfaces/coin-interface';

@Injectable()
export class WalletService {

  private myCoins = {} as Coin;
  private otherCoins: Array<Coin> = [];

  private weeklyGrant : number = 100;

  private balance : number = 0;

  private user: User;
  private userSub$: Subscription;
  public wallet$: FirebaseListObservable<Coin[]>;

  constructor(private userService: UserService, private db: AngularFireDatabase) {

    this.userSub$ = this.userService.initUserSubject$.subscribe(
      user => {
        this.user = user;
        this.wallet$ = this.db.list('/users/'+this.user.$key+'/wallet/');
      },
      error => console.error(error),
      () => console.log('transaction-service constructor userSub$ obs complete')
    );
  }

  public setInitialBalance():void {
    let now = new Date();
    let day = now.getDay();
    let diff = (7 - 5 + day) % 7;
    let b = this.weeklyGrant - ((this.weeklyGrant / 7) * (diff));
    this.myCoins.amount = b;
    this.myCoins.owner = this.user.$key;
    this.myCoins.title = this.user.firstName + 'Coin';
    this.calcBalance();
  }

  private calcBalance():void {
    let total = 0;
    for (let coin of this.otherCoins) {
      total += coin.amount;
    }
    total += this.myCoins.amount;
    this.balance = total;
    this.user.balance = total;
  }
}
