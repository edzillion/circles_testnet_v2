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
  }

  public keyToValidatorName$(key: string): Observable<string> {
    return this.validatorsFirebaseObj$.map(valis => {
      let v = valis.find(vali => vali.$key === key);
      return v.displayName;
    });
  }

  public keyToValidator$(key: string): Observable<Validator> {
    return this.validatorsFirebaseObj$.map(valis => {
      let v = valis.find(vali => vali.$key === key);
      return v;
    });
  }

  public filterValidators$(searchTerm: string)  {
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

  public applyForValidation(user, validator) {
    if (!validator.appliedUsers)
      validator.appliedUsers = [user.$key];
    else
      validator.appliedUsers.push(user.$key);

    this.db.object('/validators/' + validator.$key).set(validator);
  }

}
