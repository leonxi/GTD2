import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController, IonicApp} from 'ionic-angular';
import {MenuScalePushType} from "../components/menuType/customType";
import {BackgroundMode} from '@ionic-native/background-mode';
import {AssistantService} from "../service/cordova/assistant.service";
import {DataConfig} from "../service/config/data.config";
import {RestfulClient} from "../service/util-service/restful.client";
import {FeedbackService} from "../service/cordova/feedback.service";
import {PlatformLocation} from "@angular/common";
import {UtilService} from "../service/util-service/util.service";

@Component({
  template: '<ion-nav></ion-nav>'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  constructor(private platform: Platform,
              private appCtrl: IonicApp,
              private backgroundMode: BackgroundMode,
              private speechService: AssistantService,
              private restfulClient:RestfulClient,
              private util:UtilService) {
    //特殊菜单设置
    MenuController.registerType('scalePush', MenuScalePushType);
    this.platform.ready().then(() => {
      this.util.loadingEnd();
      //允许进入后台模式
      this.backgroundMode.enable();
      //设置返回键盘（android）
      this.registerBackButtonAction();
      this.restfulClient.init();
      //跳转页面（过渡页面）
      this.nav.setRoot(DataConfig.PAGE._AL_PAGE);
    });
  }

  registerBackButtonAction(): void {
    this.platform.registerBackButtonAction(() => {
      this.util.loadingEnd();
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.appCtrl._toastPortal.getActive() || this.appCtrl._loadingPortal.getActive() || this.appCtrl._overlayPortal.getActive();
      let activePortal = this.appCtrl._modalPortal.getActive();
      if (activePortal) {
        //语音停止
        this.speechService.stopSpeak();
        activePortal.dismiss().catch(() => {
        });
        activePortal.onDidDismiss(() => {
        });
        return;
      }

      if (this.nav.canGoBack()) {
        this.nav.pop();
      } else {
        this.backgroundMode.moveToBackground();
      }

    }, 1);
  }
}
