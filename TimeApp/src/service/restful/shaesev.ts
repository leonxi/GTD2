import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {AgdPro} from "./agdsev";
import {BsModel} from "./out/bs.model";

/**
 * 计划
 */
@Injectable()
export class ShaeRestful{
  constructor(private request: RestfulClient,
              private config: RestFulConfig) {
  }
  //计划	计划上传	PU
  share(shaeData : ShareData):Promise<BsModel<P>> {

    let bsModel = new BsModel<P>();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("PU");
      this.request.post(url, shaeData).then(data => {
        //处理返回结果
        bsModel.code = data.rc;
        bsModel.message = data.rm;
        bsModel.data = data.d;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        resolve(bsModel);

      })
    });
  }


  //内建计划下载	BIPD
  downsysname(shareData : BipdshaeData):Promise<BsModel<PSurl>> {

    let bsModel = new BsModel<PSurl>();
    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("BIPD");
      this.request.post(url, shareData).then(data => {
        //处理返回结果
        bsModel.code = data.rc;
        bsModel.message = data.rm;
        bsModel.data = data.d;
        resolve(bsModel);

      }).catch(error => {
        //处理返回错误
        bsModel.code = -99;
        bsModel.message = "处理出错";
        resolve(bsModel);

      })
    });
  }
}

//计划上传
export  class ShareData{
  //操作帐户ID
  oai : string;
  //操作手机号码
  ompn:string;
  //上下文（可以为空）
  c:string;
  //日程
  d:D = new D();
}

export class D{
  p:P = new P();
}

export class P{
  pn :any;
  // 计划内日程，复用日程分享实体
  pa :Array<AgdPro> =new Array<AgdPro>();
}

//计划上传出参
export class PSurl{
  psurl:string = "";
}



//内建计划下载
export  class BipdshaeData{
  //操作帐户ID
  oai : string;
  //操作手机号码
  ompn:string;
  //上下文（可以为空）
  c:string;
  //日程
  d:SharePro = new SharePro();
}

export class SharePro{
  pi :string;
}
