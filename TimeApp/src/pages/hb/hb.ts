import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { XiaojiAssistantService } from "../../service/util-service/xiaoji-assistant.service";
import { ParamsService } from "../../service/util-service/params.service";
import { AiuiModel } from "../../model/aiui.model";
import { ScheduleModel } from "../../model/schedule.model";
import { XiaojiFeedbackService } from "../../service/util-service/xiaoji-feedback.service";
import { DwEmitService } from "../../service/util-service/dw-emit.service";
import { DataConfig } from "../../app/data.config";
import { WsEnumModel } from "../../model/ws/ws.enum.model";
import { NetworkService } from "../../service/util-service/network.service";
import {Hb01Page} from "../hb01/hb01";

declare var cordova: any;

/**
 * Generated class for the HbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hb',
  template: `<div  class="speechWarp"> 
      <ion-header > 
        <ion-toolbar> 
          <ion-buttons left> 
            <button ion-button icon-only (click)="goBack()"> 
              <ion-icon name="arrow-back" style=" color: white"></ion-icon> 
            </button> 
          </ion-buttons> 
        </ion-toolbar> 
      </ion-header> 
      <ion-content> 
        <ion-list class="yyWarp">
          
          <ion-item  *ngFor="let message of messages"  on-hold="onMessageHold($event, $index, message)"> 
            <!-- 判断消息是用户 --> 
            <div *ngIf="U1 == message.tt" class="userTalk animated bounceIn"> 
              <h2 [innerHTML]="message.ut"></h2> 
            </div> 
            <!-- 判断消息是讯飞 --> 
            <div *ngIf="S1 == message.tt" class="XFTalk animated bounceIn"> 
              <!--  wave--> 
              <h2 [innerHTML]="message.at"></h2> 
              <h3></h3> 
            </div> 
            <!-- 判断消息是数据：list --> 
            <ion-card *ngIf="S5 == message.tt"  class="scl_list animated bounceIn"> 
              <ion-list> 
                <ion-item *ngFor="let sj of message.scL" (click)="showScheduleDetail(sj)"> 
                  <h2>{{sj.sd}}</h2> 
                  <p> 
                    <ion-badge>{{sj.sN}}</ion-badge> 
                  </p> 
                </ion-item> 
              </ion-list> 
            </ion-card> 
            <!-- 判断消息是数据：新增日程 --> 
            <div *ngIf="S4 == message.tt" class="userTalk animated bounceIn">
              <div col-10 class="cc1" >
                <div class="cc2">
                  <div style="padding:10px;">
                    <img class="cc3" src="./assets/imgs/headImg.jpg">
                    <div class="cc4">名称</div>
                  </div>
                  <div style="padding:10px;">
                    <div class="cc3">图片</div>
                    <div class="cc4">名称</div>
                  </div>
                  <div style="padding:10px;">
                    <div class="cc3">图片</div>
                    <div class="cc4"></div>
                  </div>
                </div>
                <div class="cc2" padding>
                  <div style="border-radius: 5px;">
                    <button class="cc5">
                      <div float-right class="cc6">
                        <div class="cc7"></div>
                      </div>
                      <div float-right  style="font-size: 15px;padding: 3px;">标签</div>
                    </button>
                  </div>
                  <div style="padding-left: 10px" >
                    <div style="font-size: 19px;padding-bottom: 10px">中午和杨洋在星巴克见面</div>
                    <div>
                      <div style="border-radius: 5px;border:1px solid #999999;color:#999999;width: fit-content;padding: 6px">14:00AM</div>
                    </div>
                  </div>
                </div>
                <div class="cc8">
                  <button class="cc9" style="color: #666666;">取消</button>
                  <button class="cc9" style="color: #222222;">发送</button>
                </div>
              </div>
            </div> 
          </ion-item> 
        </ion-list> 
        <!--<ion-fab left bottom edge #fab1 color="dark">--> 
        <!--<button ion-fab mini ><ion-icon name="arrow-dropup"></ion-icon></button>--> 
        <!--<ion-fab-list  side="top">--> 
        <!--<button ion-fab (click)="openSocial(1, fab1)" color="dark"><ion-icon name="create"></ion-icon></button>--> 
        <!--<button ion-fab (click)="openSocial(2, fab1)" color="secondary"><ion-icon name="contacts"></ion-icon></button>--> 
        <!--<button ion-fab (click)="openSocial(3, fab1)" color="danger"><ion-icon name="add"></ion-icon></button>--> 
        <!--</ion-fab-list>--> 
        <!--</ion-fab>--> 
      </ion-content> 
      <ion-footer> 
        <ion-toolbar  *ngIf="modeFlag == true; else xjInput"> 
          <ion-buttons left> 
            <button ion-button icon-only (click)="switchInput()"> 
              <ion-icon name="create"></ion-icon> 
            </button> 
          </ion-buttons> 
          <img  src="./assets/imgs/yuying.png"   (click)="startXiaoJi()" /> 
        </ion-toolbar> 
        <ng-template #xjInput> 
          <ion-toolbar style="margin-top: 18px" class="animated bounceIn faster"> 
            <ion-buttons left> 
              <button ion-button icon-only (click)="switchInput()"> 
                <ion-icon name="mic" style=" color: white"></ion-icon> 
              </button> 
            </ion-buttons> 
            <ion-input id="userInput" type="text" [(ngModel)]="inputText" placeholder="来传小纸条吧"></ion-input> 
            <ion-buttons end> 
              <button ion-button icon-end color="royal" (click)="startXiaojiText()"> 
                <ion-icon name="send"></ion-icon> 
              </button> 
            </ion-buttons> 
          </ion-toolbar> 
        </ng-template> 
        <page-hb01></page-hb01>
      </ion-footer> 
    </div>`,
})
export class HbPage {
  @ViewChild(Hb01Page) hb01Page:Hb01Page;
  @ViewChild(Content) content: Content;


  data: any;
  modeFlag: boolean = true;   //判断助手模式 true语音false手输

  U1: string = DataConfig.U1;
  S1: string = DataConfig.S1;
  S4: string = DataConfig.S4;
  S5: string = DataConfig.S5;
  S6: string = DataConfig.S6;

  userText: string; //用户输入显示文本
  speech: string;   //语音助手显示文本
  inputText: string = "";    //手动模式输入数据
  filePath: string;   //语音文件路径

  schedule: ScheduleModel;
  inputData: AiuiModel = new AiuiModel();
  messages: Array<AiuiModel>; //聊天数据队列
  //语音界面数据传递

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController,
              private dwEmit: DwEmitService,
              public paramsService: ParamsService,
              public xiaojiSpeech: XiaojiAssistantService,
              private networkService: NetworkService,
              public xiaojiFeekback: XiaojiFeedbackService) {

  }


  ionViewDidLoad() {

    this.dwEmit.getHbData((data) => {
      this.messageHanding(data);
    });

    this.netNetwork();

    this.messages = [];
    this.inputData = new AiuiModel();

    //语音唤醒冲突暂时关闭
    //this.initWakeUp();

    console.log('ionViewDidLoad HbPage');
     this.hb01Page.loadScene();
    this.hb01Page.setDrawType(1);
    // this.initWakeUp();

  }


  initWakeUp() {
    this.xiaojiSpeech.initbaiduWakeUp(isWakeUp => {
      this.xiaojiSpeech.baiduWakeUpStop();
      if (!isWakeUp) {
        this.initWakeUp();
      }
      this.xiaojiSpeech.speakText("小吉在呢，请吩咐", speakRs => {
        this.xiaojiSpeech.listenAudio(data => {
          this.initWakeUp();
          this.messageHanding(data);
        })
      })
    });

  }

  //添加日程
  addSchedule() {
    this.navCtrl.push("SbPage")
  }

  //群组详情
  groupListShow() {
    this.navCtrl.push('GroupListPage', {popPage: 'HbPage'});
  }

  /*==================== 聊天界面 start ===================*/

  switchInput() {
    this.xiaojiFeekback.audioBass();

    //切换手动输入模式
    this.modeFlag = !this.modeFlag;
    if (this.modeFlag)
      this.hb01Page.setDrawType(1);
    else
      this.hb01Page.setDrawType(0);
    return;
  }

  //启动语音输入
  startXiaoJi() {
    console.log("开始语音输入");
    if (this.xiaojiSpeech.islistenAudioing) {
      this.xiaojiSpeech.stopSpeak();
      return;
    }
    this.hb01Page.setDrawType(2);
    this.xiaojiSpeech.listenAudio(rs => {
      rs = rs.replace("[asr.partial]", "");
      this.speechInputHanding(rs);
      this.xiaojiFeekback.audioSnare();

      this.hb01Page.setDrawType(0);
      setTimeout(()=>{
        this.hb01Page.setDrawType(1);
      },1000);
    });
  }

  //启动手动输入
  startXiaojiText() {

    if (this.inputText != null && this.inputText != "") {
      this.speechInputHanding(this.inputText);
      this.xiaojiSpeech.listenText(this.inputText);
    }
    this.inputText = "";
  }

  //语音输入页面处理
  speechInputHanding(text) {
    this.inputData.tt = this.U1;
    this.inputData.ut = text;
    this.messages.unshift(this.inputData);
    this.inputData = new AiuiModel();

  }

  //回传数据处理
  messageHanding($event: AiuiModel) {

    console.log("这是语音HbPage页面数据处理：messageHanding方法");

    let textU = new AiuiModel();
    let textX = new AiuiModel();
    let data = new AiuiModel();

    if ($event.tt == DataConfig.U1) {
      // textU = $event;
      // this.messages.unshift(textU);
    } else if ($event.tt == DataConfig.S1) {
      textX.tt = $event.tt;
      textX.at = $event.at;
      this.messages.unshift(textX);
      this.xiaojiSpeech.speakText(textX.at, success => {});
    } else if ($event.tt == DataConfig.S4) {
      textX.tt = DataConfig.S1;
      textX.at = $event.at;
      this.messages.unshift(textX);
      this.xiaojiSpeech.speakText(textX.at, success => {
        data.tt = $event.tt;
        data.sc = $event.sc;
        this.messages.unshift(data);
      });
    }else if ($event.tt == DataConfig.S5) {
      textX.tt = DataConfig.S1;
      textX.at = $event.at;
      this.messages.unshift(textX);
      this.xiaojiSpeech.speakText(textX.at, success => {
        data.tt = $event.tt;
        data.scL = $event.scL;
        this.messages.unshift(data);
      });
    }

  }

  //展示数据详情
  showScheduleDetail(schedule) {
    this.schedule = new ScheduleModel();
    this.schedule = schedule;
    this.paramsService.schedule = this.schedule;
    console.log("schedule:" + this.paramsService.schedule);
    this.navCtrl.push("SaPage");
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }

  /**
   * 没网络禁用语音按钮
   */
  private netNetwork() {
    if (this.networkService.getNetworkType() === 'none') {
      //WsEnumModel["E04"] + UtilService.randInt(0,10);
      let aiui = new AiuiModel();
      aiui.tt = this.S1;
      aiui.at = DataConfig.TEXT_CONTENT.get(WsEnumModel["E04"] + "1");
      this.messages.push(aiui);
      this.xiaojiSpeech.speakText(aiui.at, success=>{});
    }
  }

  /*==================== 聊天界面 end ===================*/

  //返回方法
  goBack() {
    this.dwEmit.destroyHbData();
    this.xiaojiSpeech.stopListenAudio();
    this.xiaojiSpeech.stopSpeak();
    this.viewCtrl.dismiss();
  }

  // reset(){
  //   this.Hb01Page.startHue += 60;
  //   this.Hb01Page.reset();
  // }

}
