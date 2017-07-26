import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


import { GoogleAnalytics } from '@ionic-native/google-analytics';

import 'angular2-notifications';

import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { LogPage } from '../pages/log/log';
import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';
import { LoginEmailPage } from '../pages/login-email/login-email';
import { SignupEmailPage } from '../pages/signup-email/signup-email';

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

@NgModule({
  declarations: [
    LoginEmailPage,
    LoginPage,
    LogPage,
    MyApp,
    ProfilePage,
    SearchPage,
    SignupEmailPage,
    TabsPage
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    SuperTabsModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LoginEmailPage,
    LoginPage,
    LogPage,
    MyApp,
    ProfilePage,
    SearchPage,
    SignupEmailPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AnalyticsService,
    GoogleAnalytics,
    PushService,
    UserService,
    TransactionService,
    NewsService,
    // PushService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
