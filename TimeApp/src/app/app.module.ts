import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";
import { File } from "@ionic-native/file";
import { Base64 } from "@ionic-native/base64";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification'
import { ParamsService } from "../service/params.service";
import { XiaojiAssistantService } from "../service/xiaoji-assistant.service";


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true',
      //强制使用IOS风格
      mode: 'ios'
    }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    Base64,
    ParamsService,
    XiaojiAssistantService,
    LocalNotifications,
    PhonegapLocalNotification,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
