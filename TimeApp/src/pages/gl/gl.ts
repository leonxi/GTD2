import {Component} from '@angular/core';
import {
  AlertController, IonicPage, ModalController, NavController, NavParams, Platform,
  ViewController
} from 'ionic-angular';
import {GlService} from "./gl.service";
import {GcService, PageDcData} from "../gc/gc.service";
import {GcPage} from "../gc/gc";

/**
 * Generated class for the 群组列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gl',
  template:`
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <ion-icon name="arrow-back"></ion-icon>
          </button>
        </ion-buttons>
        <ion-title>群组</ion-title>
        <ion-buttons right>
          <button ion-button (click)="toGroupCreate()" color="danger">
            <ion-icon name="add"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            <ion-item class="plan-list-item"  *ngFor="let g of gl">
              <ion-item (click)="toGroupMember(g)" style="background-color: black;color:#ffffff">
                {{g.gn}}({{g.gc}})
              </ion-item>
              <button ion-button color="danger" (click)="delGroup(g)" clear item-end>
                <img src="./assets/imgs/del_group.png">
              </button>
            </ion-item>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
`,
})
export class GlPage {
  gl:Array<PageDcData> = new Array<PageDcData>()

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public view: ViewController,
              private gcService:GcService,
              private glService:GlService,
              public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    this.getGroups()
    console.log('ionViewDidLoad PaPage');
  }


  toGroupMember(g){
    console.log('PaPage跳转PdPage');
    this.navCtrl.push('GcPage',{g:g});
  }

  toGroupCreate(){
    // let profileModal = this.modalCtrl.create('ModalContentPage',{"charNum":0});
    // profileModal.present();
    const prompt = this.alertCtrl.create({
     title: '新建群组',
      /*    message: "Enter a name for this new album you're so keen on adding",*/
      inputs: [
        {
          name: 'title',
          placeholder: '群组名称'
        },
      ],
      buttons: [
        // {
        //   text: 'Cancel',
        //   handler: data => {
        //     console.log('Cancel clicked');
        //   }
        // },
        {
          text: 'Save',
          handler: data => {
            let tt = data.title;
            console.log('title:' + tt);
            if(tt == null || tt ==""){
              //alert("群组名不能为空")
              this.toGroupCreate()
            }else{
              let dc:PageDcData = new PageDcData();
              dc.gn = tt;
              this.gcService.save(dc).then(data=>{
                if(data.code == 0){
                  this.getGroups();
                }
              })
            }

          }
        }
      ]
    });
    prompt.present();

  }

  getGroups(){
    this.glService.getGroups().then(data=>{
      this.gl = data.gl;
    }).catch(e=>{
      alert(e.message);
    })
  }

  goBack() {
    this.navCtrl.pop();
  }

  queryPerson(){

  }

  delPerson(u){

  }

  delGroup(g:PageDcData){
    this.gcService.delete(g.gi).then(data=>{
      if(data.code==0){
        this.getGroups();
        console.log('delGroup ============== 删除成功')
      }

    })
  }

  queryGroup(){

  }

  ionViewWillEnter(){
    // console.log("查询登陆用户");
    // this.uo = DataConfig.uInfo;
    // console.log("查询个人");
    // this.queryPerson();
    // console.log("查询群组");
    // this.queryGroup();
  }

}

