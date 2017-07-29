import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Validator } from '../../interfaces/validator-interface'

@Injectable()
export class ValidatorService {

  public validators$: FirebaseListObservable<Validator[]>;
  public validators: Array<Validator>;

  constructor(private db: AngularFireDatabase) {

    this.validators$ = this.db.list('/validators/');
    this.validators = [];
    this.validators$.subscribe(
      valis => {
        for (let v of valis)
          this.validators[v.$key] = v;

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

}
