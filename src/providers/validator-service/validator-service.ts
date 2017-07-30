import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';

import { Validator } from '../../interfaces/validator-interface'

@Injectable()
export class ValidatorService {

  public validators$: FirebaseListObservable<Validator[]>;
  public validators: Array<Validator>;
  private userSub$: Subscription;


  constructor(private db: AngularFireDatabase, private userService: UserService) {
    this.validators$ = this.db.list('/validators/');
    this.validators$.subscribe(
      valis => {
        debugger;
        this.validators = [];
        for (let v of valis) {
          this.validators[v.$key] = v;
        }
      }
    );

    this.userSub$ = this.userService.user$.subscribe(
      user => {
        if (user.validators) {
          this.setUserValidators(user);
        }
      }
    );
  }

  public setUserValidators(user) {
    let vals = [...user.validators];
    user.validators = [];
    for (let i in vals) {
      let key = vals[i];
      user.validators[key] = this.validators[key];
    }
  }

  public filterValidators$(searchTerm: string) {
    //if (!searchTerm)
    //  return Observable.empty(); //todo: should this return an observable(false) or something?
    return this.validators$.map((valis) => {
      return valis.filter((vali) => {
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
