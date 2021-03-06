import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from "../../service/params.service";

/**
 * Generated class for the UserSetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-set',
  templateUrl: 'user-set.html',
  providers: []
})
export class UserSetPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserSetPage');
  }


  logOut() {
    this.paramsService.user = null;
    window.localStorage.clear();
    this.navCtrl.push("UserLoginPage");
  }

  accountSecurity() {

  }

  newsMessage() {

  }

  cleanCache() {

  }

  shareApp() {

  }

  aboutApp() {

  }

  helpAndFeedback() {

  }
}
