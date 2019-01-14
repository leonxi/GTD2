import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs } from 'ionic-angular';
import {PageConfig} from "../../app/page.config";
import {UserService} from "../../service/user.service";
import {UModel} from "../../model/u.model";
import {UEntity} from "../../entity/u.entity";
import {DataConfig} from "../../app/data.config";

/**
 * Generated class for the HzPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hz',
  templateUrl: 'hz.html',
  providers: []
})
export class HzPage {
  @ViewChild('myTabs') tabRef: Tabs;

  haPage: any = PageConfig.HA_PAGE;
  // uo: UModel;
  uo:UEntity;
  imgurl:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userService: UserService) {
    this.uo = DataConfig.uInfo;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HzPage');
    this.imgurl = "./assets/imgs/headImg.jpg";
  }


  userSet() {
    console.log("跳转设置页HzPage跳转AaPage");
    this.navCtrl.push("AaPage");

  }

  inPrivate() {

  }

  playerListShow() {
    console.log("跳转参与人页HzPage跳转PaPage");
    this.navCtrl.push('PaPage',{popPage:'HzPage'});
  }

  sbAdd(){
    console.log("跳转日程添加HzPage跳转SbPage");
    this.navCtrl.push('SbPage',{popPage:'HzPage'});
  }

  toSx(){
    console.log("跳转计划一览SxPage");
    this.navCtrl.push(PageConfig.SX_PAGE);
  }

  toUc(){
    console.log("跳转用户详情HzPage跳转UcPage");
    this.navCtrl.push('UcPage',{popPage:'HzPage',uo:this.uo});
  }

  toUb(){
    console.log("跳转用户详情HzPage跳转UbPage");
    this.navCtrl.push(PageConfig.UB_PAGE);
  }

  showHistory() {

  }

  ionViewWillEnter(){
    // console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
    //this.getuo();
    console.log("ionViewWillEnter 刷新HzPage :: ");
    this.uo = DataConfig.uInfo;
    console.log("hz 获取用户信息："+JSON.stringify(this.uo));
  }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }

}
