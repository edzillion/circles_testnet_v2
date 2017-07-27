import { Injectable, OnDestroy } from '@angular/core';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/map';

import { User } from '../../interfaces/user-interface';

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

  private user: User;
  //private userStub: User;
  private email: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {

    this.authState$ = this.afAuth.authState;
    this.authSub$ = this.afAuth.authState.subscribe(
      auth => {
        if (auth) {
          let userObs = this.db.object('/users/' + auth.uid);
          let userSub = userObs.subscribe(
            user => {
              if (!user.$exists()) {
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

              }
            });
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
    return;
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
