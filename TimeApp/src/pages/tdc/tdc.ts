import {Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {
  IonicPage, LoadingController, NavController, NavParams, AlertController, Navbar,
  ModalController, Events, Alert
} from 'ionic-angular';
import { UtilService } from "../../service/util-service/util.service";
import * as moment from "moment";
import { DataConfig } from "../../service/config/data.config";
import {DateTime} from "ionic-angular/components/datetime/datetime";
import {Select} from "ionic-angular/components/select/select";

/**
 * Generated class for the 新建日程 page.
 * create by wzy
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tdc',
  providers: [],
  template:`<ion-content padding>
    <ion-grid>
      <!--<ion-row justify-content-center>
      <ul class="sphere-inner">
      <li class="a"><div class="container">
      <div class="wave"></div>
      </div></li>
      <li class="b"><div class="container">
      <div class="wave1"></div>
      </div></li>
      <li class="c"><div class="container">
      <div class="wave2"></div>
      </div></li>
      <li class="d"><div class="container">
      <div class="wave3"></div>
      </div></li>
      </ul>
      </ion-row>-->
      <ion-row justify-content-center>
        <h1>今天</h1>
      </ion-row>
      <ion-row justify-content-center>
        <p>二月 23</p>
      </ion-row>
      <ion-row justify-content-center>
        <div>
          <button ion-button clear class="text-btn">设置全天</button>
        </div>
        <div>
          <button ion-button clear class="text-btn" id="rangestart">3:00下午</button>
          →
          <button ion-button clear class="text-btn">{{rangeEnd}}</button>
        </div>
      </ion-row>
      <ion-row justify-content-center>
        <ion-input type="text" value="" placeholder="喜马拉雅儿子的生日聚会" text-center></ion-input>
      </ion-row>
      <!--<ion-row justify-content-center>
      <div class="container">
      <div class="wave"></div>
      </div>
      </ion-row>-->
      <ion-row justify-content-center>
        <scroll-select [options]="labels" [value]="0"></scroll-select>
      </ion-row>
      <ion-row justify-content-center>
        <scroll-select [options]="months" [value]="'10'"></scroll-select>
      </ion-row>
      <p padding></p>
      <ion-row justify-content-center>
        <scroll-select [options]="months" [value]="'03'" [type]="'scroll-without-button'" [items]="5"></scroll-select>
      </ion-row>
      <p padding></p>
      <ion-row justify-content-center>
        <scroll-select [options]="years" [value]="'2019'" [type]="'scroll-without-button'" [items]="7"></scroll-select>
      </ion-row>
      <p padding></p>
      <ion-row class="full-width" justify-content-center>
        <scroll-range-picker max="24" min="5" value="18:00" (changed)="timechanged($event)"></scroll-range-picker>
      </ion-row>
      <ion-row justify-content-center>
        <scroll-select class="image-scroll-select" [options]="motions" [value]="'Party'"></scroll-select>
      </ion-row>
    </ion-grid>
  </ion-content>`

})
export class TdcPage {
  //


}

