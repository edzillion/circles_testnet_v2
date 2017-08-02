import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, Toast, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AnalyticsService } from '../../providers/analytics-service/analytics-service';

import { AngularFireAuth } from 'angularfire2/auth';

import { UserService } from '../../providers/user-service/user-service';
import { User } from '../../interfaces/user-interface';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-signup-email',
  templateUrl: 'signup-email.html',
})
export class SignupEmailPage {

  private toast: Toast;
  private createUserForm: FormGroup;
  private loading: Loading;

  constructor(
    private analytics: AnalyticsService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userService: UserService
  ) {

    this.createUserForm = formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null,  Validators.compose([Validators.required, Validators.email])],
      password1: [null, Validators.required],
      password2: [null, Validators.required],
    }, { validator: this.passwordsAreEqual.bind(this) });
  }

  private onSubmit(formData: any, formValid: boolean): void {
    if (!formValid)
      return;

    this.userService.createUser(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password1
    );

  }

  private passwordsAreEqual(ctrl: FormControl): any {
    if (this.createUserForm && this.createUserForm.controls.password1.value) {
      let valid = this.createUserForm.controls.password1.value == this.createUserForm.controls.password2.value;
      return valid ? null : { 'passwordsAreEqual': true };
    }
  }

  ionViewDidLoad() {
    this.analytics.trackPageView('Signup Email Page');
  }

}
