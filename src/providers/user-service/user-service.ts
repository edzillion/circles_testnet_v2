import { Injectable, OnDestroy } from '@angular/core';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
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

@Injectable()
export class UserService implements OnDestroy {

  public initUserSubject$: ReplaySubject<any> = new ReplaySubject<any>(1);

  private userSubject$: BehaviorSubject<User>;
  private usersSubject$: ReplaySubject<Array<User>> = new ReplaySubject<Array<User>>(1);

  public user$: Observable<User>;
  public userFirebaseObj$: FirebaseObjectObservable<User>;
  public users$ = this.usersSubject$.asObservable();
  public authState$: any;

  private authSub$: Subscription;
  private userSub$: Subscription;
  private usersSub$: Subscription;

  //private createdAt: number;
  private weeklyGrant: number = 100;


  private myCoins: Coin = {} as Coin;

  private allCoins: {[key:string]: Coin};

  private user = {} as User;
  //private userStub: User;
  private email: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {

    this.user.createdAt = 0;

    this.authState$ = this.afAuth.authState;
    this.authSub$ = this.afAuth.authState.subscribe(
      auth => {
        if (auth) {
          let userObs = this.db.object('/users/' + auth.uid);
          let userSub = userObs.subscribe(
            user => {
              if (!user.$exists()) {
                //user doesn't exist, create user entry on db
                this.user.createdAt = firebase.database['ServerValue']['TIMESTAMP'];
                this.user.authProviders = ["email"];
                this.setInitialWallet(auth.uid);
                this.user.totalReceived = 0;
                this.user.totalSent = 0;
                this.user.weeklyReceived = 0;
                this.user.weeklySent = 0;
                userObs.set(this.user);
              }
              else {
                this.userSubject$ = new BehaviorSubject(user);
                this.user$ = this.userSubject$.asObservable();
                // this.userSubject$ is our app wide current user Subscription
                this.userFirebaseObj$ = this.db.object('/users/' + auth.uid);
                this.userSub$ = this.userFirebaseObj$.subscribe(
                  user => {
                    this.user = user;
                    this.initUserSubject$.next(user)
                    this.userSubject$.next(user);
                  },
                  error => console.log('Could not load current user record.')
                );

                this.usersSub$ = this.db.list('/users/').subscribe(
                  users => {
                    //clone the users array so that we don't change a user accidentally
                    //Object.assign(this.dataStore.users, users);
                    this.usersSubject$.next(users);
                  },
                  error => console.log('Could not load users.')
                );
                userSub.unsubscribe();
              }
            },
            error => console.error(error),
            () => { }
          );
        }
        else { //auth=null
          //wipe on logout
          this.user = {} as User;
        }
      },
      error => console.error(error),
      () => { }
    );
  }

  public keyToUser$(key: string): Observable<User> {
    return this.users$.map(
      users => users.find(user => user.$key === key)
    );
  }

  public keyToUserName$(key: string): Observable<string> {
    return this.users$.map(users => {
      let u = users.find(user => user.$key === key);
      return u.displayName;
    });
  }

  public filterUsers$(searchTerm: string) {
    if (!searchTerm)
      return false; //todo: should this return an observable(false) or something?
    return this.users$.map((users) => {
      return users.filter((user) => {
        if (!user.displayName || user.$key == 'undefined' || (user.$key == this.user.$key))
          return false;
        let s = searchTerm.toLowerCase();
        let d = user.displayName.toLowerCase();
        return d.indexOf(s) > -1;
      });
    });
  }

  public async update(updateObject: Object) {
    try {
      let result = await this.userFirebaseObj$.update(updateObject);
      console.log(result);
    } catch (error) {
      console.error(error);
      throw new Error("userService update fail");
    }
  }

  public signInEmail(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public signInRedirect(provider) {
    return this.afAuth.auth.signInWithRedirect(provider);
  }

  public async createUser(email, password) {
    let u = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    this.user.email = u.email;
  }

  public async addTrustedUser(userKey) {
    this.user.trustedUsers.push(userKey);
    let userObs = this.db.object('/users/' + this.user.$key);
    userObs.update({trustedUsers: this.user.trustedUsers});
  }

  public async removeTrustedUser(userKey) {
    let arr = this.user.trustedUsers.filter( user =>
	     user != userKey
     );
    let userObs = this.db.object('/users/' + this.user.$key);
    await userObs.update({trustedUsers: arr});
  }

  private setInitialWallet(userKey):void {
    let now = new Date();
    let day = now.getDay();
    let diff = (7 - 5 + day) % 7;
    let b = this.weeklyGrant - ((this.weeklyGrant / 7) * (diff));
    this.myCoins.amount = Math.round(b);
    this.myCoins.owner = userKey;
    this.myCoins.title = (this.user.firstName) ? this.user.firstName + 'Coin' : 'CircleCoin';
    //my coins are always the highest priority
    this.myCoins.priority = 0;
    this.allCoins = {
      [userKey]: this.myCoins,
    }
    this.user.wallet = this.allCoins;
    this.setBalance();
  }

  public setBalance():void {
    let total = 0;
    for (let i in this.user.wallet) {
      total += this.user.wallet[i].amount;
    }
    this.user.balance = total;
  }

  public signOut() {
    return this.afAuth.auth.signOut();
  }

  ngOnDestroy() {
    this.authSub$.unsubscribe();
    this.userSub$.unsubscribe();
    this.usersSub$.unsubscribe();
  }
}
