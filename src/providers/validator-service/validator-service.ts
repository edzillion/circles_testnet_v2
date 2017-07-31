import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { User } from '../../interfaces/user-interface';

import { Validator } from '../../interfaces/validator-interface'

@Injectable()
export class ValidatorService {

  public validatorsFirebaseObj$: FirebaseListObservable<Validator[]>;
  public validators: Array<Validator>;
  public validatorArray: Array<Validator>;
  public initValSubject$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public validators$: Observable<Validator[]>;

  constructor(private db: AngularFireDatabase) {

    this.validators$ = this.initValSubject$.asObservable();

    this.validatorsFirebaseObj$ = this.db.list('/validators/');
    this.validatorsFirebaseObj$.subscribe(
      valis => {
        this.validatorArray = valis;
        this.validators = [];
        for (let v of valis) {
          this.validators[v.$key] = v;
        }
        this.initValSubject$.next(this.validators);
      }
    );

    // this.userSub$ = this.userService.user$.subscribe(
    //   user => {
    //     if (user.validators) {
    //       this.setUserValidators(user);
    //     }
    //   }
    // );
  }

  // public setUserValidators(user) {
  //   let vals = [...user.validators];
  //   user.validators = [];
  //   for (let i in vals) {
  //     let key = vals[i];
  //     user.validators[key] = this.validators[key];
  //   }
  // }

  public filterValidators$(searchTerm: string): Array<Validator> {
    //if (!searchTerm)
    //  return Observable.empty(); //todo: should this return an observable(false) or something?
    // return this.validators$.map((valis) => {
    //   let l = this.validatorArray;
    debugger;
    return this.validatorArray.filter(vali => {
      debugger;
      if (!vali.displayName || vali.$key == 'undefined')
        return false;
      let s = searchTerm.toLowerCase();
      let d = vali.displayName.toLowerCase();
      return d.indexOf(s) > -1;
    });
    // if (!Array.isArray(filt))
    //   filt = [filt];
    //
    // return filt;
    //});
  }

  public applyForValidation(user, validator) {
    if (!validator.appliedUsers)
      validator.appliedUsers = [user.$key];
    else
      validator.appliedUsers.push(user.$key);

    this.db.object('/validators/' + validator.$key).set(validator);
  }

}
