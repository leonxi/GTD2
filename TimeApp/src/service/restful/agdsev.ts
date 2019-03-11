import { Injectable } from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";



/**
 * 日程操作
 */
@Injectable()
export class AgdRestful{
  constructor(private request: RestfulClient, private config: RestFulConfig) {

  }


  //日程保存 AS
  save(agdSave:AgdSave):Promise<AgdSave> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("AS");
      this.request.post(url, agdSave.reqData).then(data => {
        //处理返回结果
        agdSave.repData.code = data.rc;
        agdSave.repData.message = data.rm;
        agdSave.repData.data = data.d;
        resolve(agdSave);

      }).catch(error => {
        //处理返回错误
        agdSave.repData.code = "-99";
        resolve(agdSave);

      })
    });

  }

  //日程参与人保存 ACS
  contactssave():Promise<any> {

    return new Promise((resolve, reject) => {

    });
  }
  //日程获取 AG
  get():Promise<any> {

    return new Promise((resolve, reject) => {

    });
  }

  //日程删除 AR
  remove():Promise<any> {

    return new Promise((resolve, reject) => {

    });
  }


  //日程转发(分享)上传 ASU
  share():Promise<any> {
    return new Promise((resolve, reject) => {

    });
  }
}

export class AgdSave{
  reqData = {
    "rai": "",
    "fc": "",
    "ai": "",
    "at": "",
    "adt": "",
    "ap": "",
    "ar": "",
    "aa": "",
    "am": "",
    "ac": {
      "ai": "",
      "mpn": "",
      "n": "",
      "a": "",
      "s": "",
      "bd": ""
    }
  }
  repData = {
    code:"",
    message:"",
    data:{},
  }


}
