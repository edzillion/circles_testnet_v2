import { Injectable, OnDestroy } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/map';

import { User } from '../../interfaces/user-interface';
import { Coin } from '../../interfaces/coin-interface';
import { Validator } from '../../interfaces/validator-interface';
import { NewsItem } from '../../interfaces/news-item-interface';

@Injectable()
export class UserService implements OnDestroy {

  public initUserSubject$: ReplaySubject<any> = new ReplaySubject<any>(1);

  private userSubject$: ReplaySubject<User> = new ReplaySubject<User>(1);
  private usersSubject$: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);

  public user$: Observable<User>;
  public userFirebaseObj$: FirebaseObjectObservable<User>;
  public users$ = this.usersSubject$.asObservable();
  public authState$: any;

  private userSub$: Subscription;
  private usersSub$: Subscription;

  public createUserData: any = {};

  private weeklyGrant: number = 100;

  private myCoins: Coin = {} as Coin;

  private allCoins: { [key: string]: Coin };

  private user = {} as User;
  public users: any;



  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {

    this.usersSub$ = this.db.list('/users/').subscribe(
      users => {
        this.users = [];
        for (let u of users) {
          this.users[u.$key] = u.userData;
        }
        this.usersSubject$.next(users);
      },
      error => console.log('Could not load users.')
    );

    this.user.createdAt = 0;
    this.authState$ = this.afAuth.authState;
    this.initUserSubject$.take(1).subscribe(
      initUser => {
        this.user$ = this.userSubject$.asObservable();
        // this.userSubject$ is our app wide current user Subscription
        this.userFirebaseObj$ = this.db.object('/users/' + initUser.$key + '/userData');
        this.userSub$ = this.userFirebaseObj$.subscribe(
          user => {
            this.user = user;
            this.setBalance();
            //this.initUserSubject$.unsubscribe();
            this.userSubject$.next(this.user);
          },
          error => console.log('Could not load current user record.')
        );
      },
      error => console.log(error),
      () => {}
    )
  }

  public async createUser(firstName, lastName, email, password) {
    let u = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    this.createUserData = {
      email: u.email,
      firstName: firstName,
      lastName: lastName
    }
  }

  public createUserRecord(auth): User {
    //user doesn't exist, create user entry on db
    this.user = {} as User;
    this.user.uid = auth.uid;
    this.user.createdAt = firebase.database['ServerValue']['TIMESTAMP'];
    this.user.email = auth.email || '';
    this.user.firstName = this.createUserData.firstName || '';
    this.user.lastName = this.createUserData.lastName || '';
    this.user.displayName = this.user.firstName + ' ' + this.user.lastName;
    this.user.authProviders = ["email","name"];
    console.log('auth uid',auth.uid);
    this.setInitialWallet(auth.uid);
    this.user.trustedUsers = [auth.uid];

    return this.user;
  }

  public keyToUser$(key: string): Observable<User> {
    return this.users$.map(
      users => users.find(user => user.uid === key)
    );
  }

  public keyToUser(key: string): User {
    let u = this.users[key];
    //if (!u)
      //todo:error message
    return u;
  }

  public keyToUserName$(key: string): Observable<string> {
    return this.users$.map(users => {
      let u = users.find(user => user.uid === key);
      return u.displayName;
    });
  }

  public keyToUserName(key: string): string {
    let d = this.users[key];
    //if (!d)
      //todo:error message
    return d.displayName;
  }

  public filterUsers$(searchTerm: string) {
    //if (!searchTerm)
    //  return Observable.empty(); //todo: should this return an observable(false) or something?
    return this.users$.map((users) => {
      users = users.map((userRecord) => {
        return userRecord.userData;
      });
      return users.filter((user) => {
        //let user = userRecord.userData as User;
        if (!user.displayName || user.uid == 'undefined' || (user.uid == this.user.uid))
          return false;
        let s = searchTerm.toLowerCase();
        let d = user.displayName.toLowerCase();
        return d.indexOf(s) > -1;
      });
    });
  }

  public signInEmail(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public signInRedirect(provider) {
    return this.afAuth.auth.signInWithRedirect(provider);
  }

  public addTrustedUser(userKey) {
    this.user.trustedUsers.push(userKey);
  }

  public removeTrustedUser(userKey) {
    this.user.trustedUsers = this.user.trustedUsers.filter(user => {
	     return user != userKey;
    });
  }

  private setInitialWallet(userKey): void {
    let now = new Date();
    let day = now.getDay();
    let diff = (7 - 5 + day) % 7;
    let b = this.weeklyGrant - ((this.weeklyGrant / 7) * (diff));
    this.myCoins.amount = Math.round(b);
    this.myCoins.owner = userKey;
    this.myCoins.title = (this.user.firstName) ? this.user.firstName + ' Coin' : 'Circle Coin';
    //my coins are always the highest priority
    this.myCoins.priority = 0;
    this.allCoins = {
      [userKey]: this.myCoins,
    }
    this.user.wallet = this.allCoins;
    this.setBalance();
  }

  public setBalance(): void {
    let total = 0;
    for (let i in this.user.wallet) {
      total += this.user.wallet[i].amount;
    }
    this.user.balance = total;
  }

  public affordTrust(userKey) {
    this.addTrustedUser(userKey);
  }

  public revokeTrust(userKey) {
    this.removeTrustedUser(userKey);
  }

  public signOut() {
    //this.clearUser();
    return this.afAuth.auth.signOut();
  }

  private clearUser() {
    let blankUser = {} as User;
    this.user = blankUser;
    if (this.userSubject$) {
      this.userSubject$.next(blankUser);
    }
  }

  public async updateUser(updateObject: Object) {
    try {
      let result = await this.userFirebaseObj$.update(updateObject);
      console.log(result);
    } catch (error) {
      console.error(error);
      throw new Error("userService update fail");
    }
  }

  public async saveUser() {
    try {
      let result = await this.userFirebaseObj$.set(this.user);
      console.log(result);
    } catch (error) {
      console.error(error);
      throw new Error("userService save fail");
    }
  }

  ngOnDestroy() {
    this.userSub$.unsubscribe();
    this.usersSub$.unsubscribe();
  }
}
