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
  public validators$: Observable<Validator[]>

  public allProviders: Array<any> = [];
  public userProviders: Array<any>;
  public valRequirements: Array<any>;

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

    this.db.list('/static/authProviders/').take(1).subscribe(
      provs => {
        for (let p of provs) {
          this.allProviders[p.$key] = p;
        }
      }
    );
  }

  public getUserProviders(user: User) {

    this.userProviders = [];
    for (let pKey in this.allProviders) {
      let p = Object.assign({}, this.allProviders[pKey]);
      if (user.authProviders.find(aKey => pKey == aKey)) {
        p.completed = true;
      }
      this.userProviders.push(p);
    }
    return this.userProviders;
  }

  public getValidatorRequirements(vali: Validator, user: User) {
    this.valRequirements = [];
    for (let req of vali.requirements) {
      let r = Object.assign({}, this.allProviders[req]);
      if (user.authProviders.find(auth => {
        return req == auth;
      })) {
        r.completed = true;
      }
      this.valRequirements.push(r);
    }
    return this.valRequirements;
  }

  public keyToValidatorName$(key: string): Observable<string> {
    return this.validatorsFirebaseObj$.map(valis => {
      let v = valis.find(vali => vali.$key === key);
      return v.displayName;
    });
  }

  public keyToValidatorName(key: string): string {
    let d = this.validators[key];
    //if (!d)
      //todo:error message
    return d.displayName;
  }

  public keyToValidator$(key: string): Observable<Validator> {
    return this.validatorsFirebaseObj$.map(valis => {
      let v = valis.find(vali => vali.$key === key);
      return v;
    });
  }

  public keyToValidator(key: string): Validator {
    let d = this.validators[key];
    //if (!d)
      //todo:error message
    return d;
  }

  public filterValidators$(searchTerm: string) {
    //if (!searchTerm)
    //  return Observable.empty(); //todo: should this return an observable(false) or something?
    return this.validatorsFirebaseObj$.map((valis) => {
      return valis.filter(vali => {

        if (!vali.displayName || vali.$key == 'undefined')
          return false;
        let s = searchTerm.toLowerCase();
        let d = vali.displayName.toLowerCase();
        return d.indexOf(s) > -1;
      });
    });
  }

  public revokeValidation(user, validator) {
    if (!validator.trustedUsers) {
    //todo:error
    }
    else {
      validator.trustedUsers = validator.trustedUsers.filter(userKey => {
        return userKey !== user.uid;
      });
    }

    if (!user.validators) {
    //todo:error
    }
    else {
      user.validators = user.validators.filter(valiKey => {
        return valiKey !== validator.$key;
      });
    }
  }

  public applyForValidation(user, validator) {
    if (!validator.appliedUsers)
      validator.appliedUsers = [user.uid];
    else
      validator.appliedUsers.push(user.uid);

  }

  public completeValidation(user, validator) {
    if (!validator.appliedUsers) {
    //todo:error
    }
    else {
      validator.appliedUsers = validator.appliedUsers.filter(userKey => {
        return userKey !== user.uid;
      });
    }

    if (!validator.trustedUsers)
      validator.trustedUsers = [user.uid];
    else
      validator.trustedUsers.push(user.uid);

    if (!user.validators)
      user.validators = [validator.$key];
    else
      user.validators.push(validator.$key);

  }

  public saveValidator(validator: Validator) {
    this.validatorsFirebaseObj$.update(validator.$key, validator);
  }

}
