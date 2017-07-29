import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FormBuilder, FormGroup, FormControl, Validators, } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/empty';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';
import { Validator } from '../../interfaces/validator-interface';

import { UserDetailPage } from '../user-detail/user-detail';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  private searchTerm: string = '';
  private search$: Observable<any[]>;
  private searchSubject$: Subject<any[]>;
  private searchControl: FormControl;

  private toUser: User;
  private user: User;
  private userSub$: Subscription;

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {

    this.searchSubject$ = new Subject();
    this.search$ = this.searchSubject$ as Observable<any>;
  }

  private setFilteredItems(): void {
    if (this.searchTerm == '') {
      this.searchSubject$.next([]);
      return;
    }
    let uObs = this.userService.filterUsers$(this.searchTerm);
    let vObs = this.userService.filterValidators$(this.searchTerm);

    Observable.combineLatest(uObs,vObs).first().subscribe(
      combined => {
          let oneArray = [...combined[0], ...combined[1]];
          this.searchSubject$.next(oneArray);
      }
  )}

  private goToUserDetail(user): void {
    // go to the contact detail page
    // and pass in the user data
    this.navCtrl.push(UserDetailPage, user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

}
