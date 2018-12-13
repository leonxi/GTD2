import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UEntity} from "../../entity/u.entity";
import {UserService} from "../../service/user.service";
import { RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";

/**
 * Generated class for the PaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pa',
  templateUrl: 'pa.html',
})
export class PaPage {

  relation: any = 'person' ;
  uo:UEntity;

  us: Array<RuModel>;
  gs: Array<RuModel>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public view: ViewController,
              public userService: UserService,
              public relmemService: RelmemService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaPage');
    this.init();
  }

  init(){
    console.log("查询登陆用户");
    this.userService.getUo().then(data=>{
      if(data.code == 0){
        this.uo = data.u;
      }
    }).catch(reason => {

    });
    console.log("查询个人");
    this.queryPerson();
    console.log("查询群组");
    this.queryGroup();
  }

  toAddMember(){
    console.log('PaPage跳转PfPage');
    this.navCtrl.push('PfPage',{uo:this.uo});
  }

  toGroupMember(g){
    console.log('PaPage跳转PdPage');
    this.navCtrl.push('PdPage',{g:g});
  }

  toGroupCreate(){
    console.log('PaPage跳转PePage');
    this.navCtrl.push("PePage",{uo:this.uo});
  }

  toMemberDetail(u){
    console.log('PaPage跳转PbPage');
    this.navCtrl.push("PbPage",{u:u});
  }

  goBack() {
    this.navCtrl.pop();
  }

  queryPerson(){
    this.relmemService.getrus("","","","","0").then(data=>{
      console.log(data);
      if(data.us != null && data.us.length > 0){
        console.log(data.us.length + "联系人不为空::" + data.us);
        this.us = data.us;
      }else{
        console.log("个人查询错误")
      }
    }).catch( reason => {
      console.log("个人查询错误::" + reason.message)
    });
  }

  delPerson(u){
    this.relmemService.delRu(u.id).then(data=>{
      if(data.code == 0){
        console.log("删除成功");
        this.queryPerson()
      }else{
        console.log("删除失败");
      }
    }).catch(reason => {
      console.log("删除异常::" + reason.message);
    })
  }

  delGroup(g){
    this.relmemService.delRu(g.id).then(data=>{
      if(data.code == 0){
        console.log("删除成功");
        this.queryGroup()
      }else{
        console.log("删除失败");
      }
    }).catch(reason => {
      console.log("删除异常::" + reason.message);
    })
  }

  queryGroup(){
    this.relmemService.getrus(null,null,null,null,'1').then(data=>{
      if(data.code == 0 && data.us != null && data.us.length > 0 ){
        console.log("查询群组成功");
        this.gs = data.us;
      }else{
        console.log("查询群组为空");
        this.gs = undefined;
      }
    }).catch(reason => {
      console.log("查询群组失败");
    });
  }

  ionViewDidEnter(){
    console.log("查询个人");
    this.queryPerson();
    console.log("查询群组");
    this.queryGroup();
  }


  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
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
