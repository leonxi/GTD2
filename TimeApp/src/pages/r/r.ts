import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {PageRData, RService} from "./r.service";
import {UtilService} from "../../service/util-service/util.service";

/**
 * Generated class for the 注册 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-r',
  template:
    `
    <ion-content padding>
      <h1>注册账号</h1>
      <ion-grid class="grid-login-basic no-padding-lr">
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input class="register-name"  type="text" placeholder="您的尊称" [(ngModel)]="rData.username" (ionBlur)="checkName()"></ion-input>
          </div>
        </ion-row>
        <ion-row justify-content-between align-items-center>
          <div class="w-auto">
            <ion-input class="register-tel" type="tel" placeholder="开始输入电话号码" [(ngModel)]="rData.mobile" (ionBlur)="checkPhone()"></ion-input>
          </div>
          <div>
            <button ion-fab color="success" (click)="register()" [ngClass]="{'show': inputBoolean == false , 'show-true': inputBoolean == true}">
            <img class="img-content-enter" src="../../assets/imgs/xyb.png">
          </button>
          </div>
        </ion-row>
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input class="register-code"  type="number" placeholder="短信验证码" [(ngModel)]="rData.authCode" (ionBlur)="checkCode()"></ion-input>
          </div>
          <div>
            <button ion-button class="register-send" (click)="sendMsg()">{{timeText}}</button>
          </div>
        </ion-row>
        
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input class="register-pwd" type="password" placeholder="密码" [(ngModel)]="rData.password" (ionBlur)="checkPwd()"></ion-input>
          </div>
        </ion-row>
      </ion-grid>

     <div class="register-div" (click)="toLp()">改为用密码登录</div>

      <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" (click)="userAgreement()">服务条款</a> 和 <a class="text-anchor" (click)="userAgreement()">隐私政策</a> 。</p>
    </ion-content>
  `,
})
export class RPage {

  rData: PageRData = new PageRData();
  errorPhone:number = 0; // 0：初始化（输入为空） 1：手机号长度小于11位 2：手机号格式错误 3：手机号正确
  errorCode:number = 0; // 0：初始化；1：验证码输入
  errorPwd:number = 0; // 0：初始化；1：密码输入
  errorName:number = 0; // 0：初始化；1：用户名输入
  inputBoolean:boolean = false;  // false： show ; true show-true
  timeText:any = "获取验证码";
  timer:any;

  constructor(public navCtrl: NavController,
              private util:UtilService,
              private rService: RService,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  userAgreement() {
    this.navCtrl.push('PPage');
  }

  toLp() {
    this.navCtrl.push('LpPage');
  }

  sendMsg(){
    if(this.errorPhone == 3){
      this.rService.sc(this.rData).then(data => {
        //console.log("短信发送成功" + JSON.stringify(data));
        //短信验证码KEY 赋值给验证码登录信息
        this.rData.verifykey = data.data.verifykey;
        //this.alert("短信发送成功");
        this.util.toast("短信发送成功",1500);

      }).catch(error => {
        console.log("短信发送失败" + JSON.stringify(error));
        this.util.toast("短信发送失败",1500);
      });

      this.timeText = 60;
      console.log("开始" + this.timeText + "定时器");
      this.timer = setInterval(() => {
        this.timeText--;
        if (this.timeText <= 0) {
          clearTimeout(this.timer);
          console.log("清除定时器");
          this.timeText = "发送验证码"
        }
      }, 1000)
    }else {
      this.util.toast("请填写正确的手机号",1500);
    }
  }

  register() {
    if(this.inputBoolean) {
      console.log("注册被点击");
      if(this.rData.verifykey != null && this.rData.verifykey != "" && this.rData.verifykey != undefined){
        this.util.loadingStart();
        this.rService.signup(this.rData).then(data => {
          if (data.code != 0)
            throw  data;

          console.log("注册并密码登录成功"+ JSON.stringify(data));
          clearTimeout(this.timer);
          this.util.loadingEnd();
          this.navCtrl.setRoot('MPage');
        }).catch(error=>{
          console.log("注册失败"+JSON.stringify(error));
          this.util.loadingEnd();
          //this.alert(error.message);
          this.util.toast("注册失败",1500);
        });
      }else{
        this.util.toast("请发送短信并填写正确的短信验证码",1500);
      }
    }else {
      this.util.toast("请将信息填写完整",1500);
    }

  }

  check(){
    if (this.errorPhone == 3 && this.errorCode == 1 && this.errorPwd == 1 && this.errorName){
      this.inputBoolean = true;
    }else {
      this.inputBoolean = false;
    }
  }

  checkPhone() {
    this.errorPhone = this.util.checkPhone(this.rData.mobile);
    this.check();

    if(this.errorPhone == 0){  //判断手机号是否为空
      this.util.toast("手机号不能为空",1500);
    }else if(this.errorPhone == 1){
      this.util.toast("手机号长度小于11位",1500);
    }else if(this.errorPhone == 2){
      this.util.toast("手机号格式错误",1500);
    }
  }

  checkCode(){
    if (this.rData.authCode != null && this.rData.authCode != "" && this.rData.authCode != undefined){     //判断验证码是否为空
      this.errorCode = 1;
    }else {
      this.errorCode = 0;
    }
    this.check();

    if(this.errorCode == 0){  //判断验证码是否为空
      this.util.toast("验证码不能为空",1500);
    }
  }

  checkPwd(){
    if (this.rData.password != null && this.rData.password != "" && this.rData.password != undefined){     //判断密码是否为空
      this.errorPwd = 1;
    }else {
      this.errorPwd = 0;
    }
    this.check();

    if(this.errorPwd == 0){  //判断密码是否为空
      this.util.toast("密码不能为空",1500);
    }
  }

  checkName(){
    if (this.rData.username != null && this.rData.username != "" && this.rData.username != undefined){     //判断用户名是否为空
      this.errorName = 1;
    }else {
      this.errorName = 0;
    }
    this.check();

    if(this.errorName == 0){  //判断用户名是否为空
      this.util.toast("用户名不能为空",1500);
    }
  }

}
