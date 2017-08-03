import { Injectable, OnDestroy } from '@angular/core';

import { NotificationsService, SimpleNotificationsComponent  } from 'angular2-notifications';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/take';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';
import { NewsItem } from '../../interfaces/news-item-interface';
import { Offer } from '../../interfaces/offer-interface';
import { Validator } from '../../interfaces/validator-interface';
//import { PushService } from '../../providers/push-service/push-service';

@Injectable()
export class NewsService implements OnDestroy {

  private user: User;

  private dbNewsItems$: FirebaseListObservable<NewsItem[]>;
  private dbNewsSub$: Subscription;

  private newsItemsReversed$: BehaviorSubject<NewsItem[]> = new BehaviorSubject([]);
  private newsItems$: BehaviorSubject<NewsItem[]> = new BehaviorSubject([]);

  constructor(
    private db: AngularFireDatabase,
    private notificationsService: NotificationsService,
    //private pushService: PushService,
    private userService: UserService
  ) {

    this.userService.initUserSubject$.subscribe(
      user => {
        this.user = user;
        this.setupDBQuery(user);
      },
      error => console.error(error),
      () => console.log('news-service constructor user$ obs complete')
    );
  }

  private setupDBQuery(user: User):void {
    // sets up a db list binding that will initially return all messages from the last
    // two minutes and then any added to the list after that.
    this.dbNewsItems$ = this.db.list('/users/' + user.uid + '/news/');
    let twoMinsAgo = Date.now() - 120000;
    this.dbNewsItems$.$ref
      .orderByChild('timestamp')
      .startAt(twoMinsAgo)
      .on('child_added', (firebaseObj,index) => {
        let latestNewsItem = firebaseObj.val();
        //receiving from someone
        if (latestNewsItem.type == 'transaction' && latestNewsItem.to == user.uid) {
          let fromUser = this.userService.keyToUser(latestNewsItem.from);
          let msg = 'Receieved ' + latestNewsItem.amount + ' Circles from ' + fromUser.displayName;
          this.notificationsService.create('Transaction', msg, 'info');
        }
      });

      this.dbNewsSub$ = this.dbNewsItems$.subscribe(
        newsitems => {
          let r = newsitems.sort((a,b) => a.timestamp < b.timestamp ? 1 : -1);
          this.newsItemsReversed$.next(r)
        },
        error => {
          console.log("Firebase Error: " + error);
        },
        () => console.log('news-service setupDBQuery dbNewsSub$ obs complete')
      );

      this.dbNewsItems$.subscribe(this.newsItems$);

  }

  public get allNewsItems$(): BehaviorSubject<NewsItem[]> {
    return this.newsItems$;
  }

  public get allnewsItemsReversed$(): BehaviorSubject<NewsItem[]> {
    return this.newsItemsReversed$;
  }

  public addTransaction(toUser:User, amount:number, message?:string):void {
    //this will only be called for sending to someone else

    // this.notificationsService.create('Send Success','','success');
    // let msg = 'Sent ' + txItem.amount + ' Circles to ' + txItem.toUser.displayName;
    // this.notificationsService.create('Transaction', msg, 'info');

    let newsItem = {
      timestamp: firebase.database['ServerValue']['TIMESTAMP'],
      from: this.user.uid,
      amount: amount,
      to: toUser.uid,
      type: 'transaction',
      message: message || ''
    } as NewsItem;
    this.dbNewsItems$.push(newsItem);

    this.db.list('/users/'+toUser.uid+'/news/').push(newsItem);

    //send push notification to other user
    //msg = 'Receieved ' + txItem.amount + ' Circles from ' + this.user.displayName;
    //this.pushService.pushToUser(txItem.toUser,msg);
  }


  public addValidatorTrustRequest(validator: Validator):void {
    //this.notificationsService.create('Join Success','','success');
    let msg = 'You applied for validation from: ' +validator.displayName;
    this.notificationsService.create('Apply', msg, 'info');

    let newsItem = {
      timestamp: firebase.database['ServerValue']['TIMESTAMP'],
      from: validator.$key,
      type: 'validatorRequest'
    } as NewsItem;
    this.dbNewsItems$.push(newsItem);
  }

  public addCreateUser(user: User):void {
    //this.notificationsService.create('Join Success','','success');
    let msg = 'Welcome to Circles ' +user.displayName +'!';
    this.notificationsService.create('User Created', msg, 'success');
    let newsItem = {
      timestamp: user.createdAt,
      type: 'createAccount'
    } as NewsItem;
    this.dbNewsItems$.push(newsItem);
  }

  public addValidatorTrustAccept(validator: Validator):void {
    //this.notificationsService.create('Join Success','','success');
    let msg = 'You have been validated by: ' +validator.displayName;
    this.notificationsService.create('Validation', msg, 'success');

    let newsItem = {
      timestamp: firebase.database['ServerValue']['TIMESTAMP'],
      from: validator.$key,
      type: 'validatorAccept'
    } as NewsItem;
    this.dbNewsItems$.push(newsItem);
  }

  public addTrust(user: User):void {
    //this.notificationsService.create('Join Success','','success');
    let msg = 'You have started trusting: ' +user.displayName;
    this.notificationsService.create('Trust', msg, 'info');

    let newsItem = {
      timestamp: firebase.database['ServerValue']['TIMESTAMP'],
      to: user.uid,
      type: 'trustUser'
    } as NewsItem;
    this.dbNewsItems$.push(newsItem);
  }

  public revokeUserTrust(user: User):void {
    //this.notificationsService.create('Join Success','','success');
    let msg = 'You have stopped trusting: ' +user.displayName;
    this.notificationsService.create('Revoke', msg, 'warn');

    let newsItem = {
      timestamp: firebase.database['ServerValue']['TIMESTAMP'],
      to: user.uid,
      type: 'revokeUser'
    } as NewsItem;
    this.dbNewsItems$.push(newsItem);
  }

  public revokeValidatorTrust(vali: Validator):void {
    //this.notificationsService.create('Join Success','','success');
    let msg = 'You are no longer validated by: ' +vali.displayName;
    this.notificationsService.create('Revoke', msg, 'warn');

    let newsItem = {
      timestamp: firebase.database['ServerValue']['TIMESTAMP'],
      to: vali.$key,
      type: 'revokeValidator'
    } as NewsItem;
    this.dbNewsItems$.push(newsItem);
  }

  ngOnDestroy () {
    this.dbNewsSub$.unsubscribe();
  }

}
