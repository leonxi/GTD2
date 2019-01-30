import {Component, ViewChild} from '@angular/core';
import { Events, IonicPage, ModalController} from 'ionic-angular';
import {RemindModel} from "../../model/remind.model";
import {
  CalendarComponent,
  CalendarComponentOptions
} from "../../components/ion2-calendar";
import * as moment from "moment";
import {Ha01Page} from "../ha01/ha01";
import {PageConfig} from "../../app/page.config";
import {UtilService} from "../../service/util-service/util.service";
import {XiaojiFeedbackService} from "../../service/util-service/xiaoji-feedback.service";
import {RcModel} from "../../model/rc.model";

/**
 * Generated class for the HaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ha',
  template:`<ion-header no-border>
    <ion-toolbar color="none">
      <ion-buttons left no-margin padding-left>
        <button ion-button icon-only menuToggle no-margin>
          <img src="./assets/imgs/menu.png"/>
        </button>
      </ion-buttons>
      <ion-buttons end no-margin padding-right>
        <button ion-button icon-only no-margin (click)="gotoToday()">
          <img src="./assets/imgs/today.png"/>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
   <div class="haContent">
      <div class="haCalendar">
        <ion-calendar [options]="options"
                      (onSelect)="onSelectDayEvent($event)"
                      (onPress)="creNewEvent($event)">
        </ion-calendar>
      </div>
      <p class="tipDay"><span class="showDay animated flipInX">{{showDay}}</span><span
       class="showDay2">{{showDay2}}</span></p>
      <page-ha01></page-ha01>
    </div>
    <div class=" animated swing  assistant" (click)="openVoice()" #assistant>
      <img src="./assets/imgs/yuying.png"/>
    </div>
  </ion-content>`,
  providers: []
})
export class HaPage {
  @ViewChild(CalendarComponent) ion2calendar: CalendarComponent;
  @ViewChild(Ha01Page) ha01Page: Ha01Page;

  remindScheduleList: Array<RemindModel>;//提醒时间数据
  remindList: Array<string>;  //全部提醒时间

  showDay: string;
  showDay2: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from: new Date(1975, 0, 1),
    daysConfig: []
  };

  constructor(private modalCtr: ModalController,
              private utilService: UtilService,
              private xiaojiFeekback: XiaojiFeedbackService,
              private events: Events) {
    moment.locale('zh-cn');
  }

  ionViewDidLoad() {

    let eventDate = new Date();
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth() + 1;
    let day = eventDate.getDate();
    this.showDay = this.utilService.showDay(moment().set({
      'year': year,
      'month': month - 1,
      'date': day
    }).format('YYYY-MM-DD'))
    this.showDay2 = moment().set({'year': year, 'month': month - 1, 'date': day}).format('dddd YYYY 年 MM 月 DD 日');

    this.events.subscribe("flashDay",(data)=>{
      let day = data.day;
      let event = data.event;
      this.ion2calendar.flashDay(day);
      this.onSelectDayEvent(event);
    });
  }

  ionViewWillEnter(){

  }


  creNewEvent($event) {
    this.xiaojiFeekback.audioHighhat();
    let eventDate = new Date($event.time);
    let tmp = moment(eventDate).format("YYYY-MM-DD");
    let sbPageModal = this.modalCtr.create(PageConfig.SB_PAGE,{dateStr:tmp,event:$event});
    sbPageModal.present();
  }

  //查询当天日程
  onSelectDayEvent($event) {
    if (!$event) {
      return;
    }
    let eventDate = new Date($event.time);
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth() + 1;
    let day = eventDate.getDate();
    this.showDay = this.utilService.showDay(moment().set({
      'year': year,
      'month': month - 1,
      'date': day
    }).format('YYYY-MM-DD'));
    this.showDay2 = moment().set({'year': year, 'month': month - 1, 'date': day}).format('dddd YYYY 年 MM 月 DD 日');

    this.ha01Page.showScheduleLs($event);
  }

  gotoToday() {
    this.ion2calendar.setViewDate(moment().format("YYYY-MM-DD"));
  }

  openVoice() {
    let tab1RootModal = this.modalCtr.create(PageConfig.HB_PAGE);
    tab1RootModal.present();
  }


}

