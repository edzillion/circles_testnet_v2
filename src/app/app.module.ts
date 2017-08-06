import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { CirclesApp } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import 'angular2-notifications';

import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { ValidatorDetailPage } from '../pages/validator-detail/validator-detail';

import { LoginPage } from '../pages/login/login';
import { LoginEmailPage } from '../pages/login-email/login-email';
import { SignupEmailPage } from '../pages/signup-email/signup-email';
import { SendPage } from '../pages/send/send';
import { ApplyPage } from '../pages/apply/apply';
import { WelcomePage } from '../pages/welcome/welcome';


import { ConfirmModal } from '../pages/confirm-modal/confirm-modal';

//side menu
import { WalletPage } from '../pages/wallet/wallet';
import { SettingsPage } from '../pages/settings/settings';

//services
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import { UserService } from '../providers/user-service/user-service';

import { TransactionService } from '../providers/transaction-service/transaction-service';
import { NewsService } from '../providers/news-service/news-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//vendor
import { SimpleNotificationsModule } from 'angular2-notifications';

//configs
import { environment } from '../environments/environment';
import { Keyobject } from '../pipes/key-object/key-object';
import { ValidatorService } from '../providers/validator-service/validator-service';
import { NewsCard } from '../components/news-card/news-card';

import pica from 'pica';

import { StorageService } from '../providers/storage-service/storage-service';
import { AuthService } from '../providers/auth-service/auth-service';

@NgModule({
  declarations: [
    ApplyPage,
    CirclesApp,
    ConfirmModal,
    HomePage,
    Keyobject,
    LoginEmailPage,
    LoginPage,
    NewsCard,
    ProfilePage,
    SearchPage,
    SendPage,
    SettingsPage,
    SignupEmailPage,
    UserDetailPage,
    ValidatorDetailPage,
    WalletPage,
    WelcomePage
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    IonicModule.forRoot(CirclesApp), //{mode: 'ios'}) //this will force 'ios' style on all platforms
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApplyPage,
    CirclesApp,
    ConfirmModal,
    HomePage,
    LoginEmailPage,
    LoginPage,
    ProfilePage,
    SearchPage,
    SendPage,
    SettingsPage,
    SignupEmailPage,
    UserDetailPage,
    ValidatorDetailPage,
    WalletPage,
    WelcomePage
  ],
  providers: [
    AuthService,
    NewsService,
    SplashScreen,
    StatusBar,
    TransactionService,
    UserService,
    // PushService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ValidatorService,
    StorageService    
  ]
})
export class AppModule {}
