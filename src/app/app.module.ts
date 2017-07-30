import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Camera } from '@ionic-native/camera';

import { GoogleAnalytics } from '@ionic-native/google-analytics';

import 'angular2-notifications';

import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { ValidatorDetailPage } from '../pages/validator-detail/validator-detail';

import { LogPage } from '../pages/log/log';

import { LoginPage } from '../pages/login/login';
import { LoginEmailPage } from '../pages/login-email/login-email';
import { SignupEmailPage } from '../pages/signup-email/signup-email';


import { SendPage } from '../pages/send/send';

//side menu
import { WalletPage } from '../pages/wallet/wallet';
import { SettingsPage } from '../pages/settings/settings';

//services
import { AnalyticsService } from '../providers/analytics-service/analytics-service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import { UserService } from '../providers/user-service/user-service';

import { TransactionService } from '../providers/transaction-service/transaction-service';
import { NewsService } from '../providers/news-service/news-service';
import { PushService } from '../providers/push-service/push-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//vendor
import { SuperTabsModule } from 'ionic2-super-tabs';
import { SimpleNotificationsModule } from 'angular2-notifications';

//configs
import { environment } from '../environments/environment';
import { Keyobject } from '../pipes/key-object/key-object';
import { ValidatorService } from '../providers/validator-service/validator-service';
import { NewsCard } from '../components/news-card/news-card';

@NgModule({
  declarations: [
    LoginEmailPage,
    LoginPage,
    LogPage,
    MyApp,
    ProfilePage,
    SearchPage,
    UserDetailPage,
    SignupEmailPage,
    SendPage,
    WalletPage,
    ValidatorDetailPage,
    Keyobject,
    SettingsPage,
    NewsCard
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    SuperTabsModule.forRoot(),
    IonicModule.forRoot(MyApp, {mode: 'ios'}) //this will force 'ios' style on all platforms
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LoginEmailPage,
    LoginPage,
    LogPage,
    MyApp,
    ProfilePage,
    SearchPage,
    UserDetailPage,
    SignupEmailPage,
    SendPage,
    WalletPage,
    ValidatorDetailPage,
    SettingsPage
  ],
  providers: [
    AnalyticsService,
    Camera,
    GoogleAnalytics,
    NewsService,
    PushService,
    SplashScreen,
    StatusBar,
    TransactionService,
    UserService,
    // PushService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ValidatorService
  ]
})
export class AppModule {}
