import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import 'angular2-notifications';

import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { LogPage } from '../pages/log/log';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//vendor
import { SuperTabsModule } from 'ionic2-super-tabs';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    SearchPage,
    LogPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    SuperTabsModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    SearchPage,
    LogPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
