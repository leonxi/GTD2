import {Injectable} from "@angular/core";
import {WorkSqlite} from "./sqlite/work-sqlite";
import {MbsoModel} from "../model/out/mbso.model";
import {MbsModel} from "../model/mbs.model";
import {RcpoModel} from "../model/out/rcpo.model";
import {RcpModel} from "../model/rcp.model";
import {BsModel} from "../model/out/bs.model";
import {RuModel} from "../model/ru.model";
import {RcEntity} from "../entity/rc.entity";
import {BaseSqlite} from "./sqlite/base-sqlite";
import {UtilService} from "./util-service/util.service";
import {RcModel} from "../model/rc.model";
import {LbSqlite} from "./sqlite/lb-sqlite";
import {LboModel} from "../model/out/lbo.model";
import {LbModel} from "../model/lb.model";
import {ScheduleModel} from "../model/schedule.model";
import {MsEntity} from "../entity/ms.entity";
import {DataConfig} from "../app/data.config";
import {PsModel} from "../model/ps.model";
import {RcRestful} from "./restful/rc-restful";
import {SkillConfig} from "../app/skill.config";
import {RelmemSqlite} from "./sqlite/relmem-sqlite";
import {RcpEntity} from "../entity/rcp.entity";
import {ReturnConfig} from "../app/return.config";
import {RcoModel} from "../model/out/rco.model";
import {WsResDataModel} from "../model/ws.res.model";
import {MsSqlite} from "./sqlite/ms-sqlite";

/**
 * 日程逻辑处理
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class WorkService {
W
  constructor(private baseSqlite : BaseSqlite,
                private util : UtilService,
                private workSqlite : WorkSqlite,
                private relmem : RelmemSqlite,
                private lbSqlite : LbSqlite,
                private msSqlite : MsSqlite,
                private rcResful:RcRestful) {
  }

  /**
   * 添加日程
   * @param {string} ct 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} jhi 计划名称
   * @param {Array}  ruL 参与人json数组[ {id,rN,rC} ]（id主键,rN名称,rC联系方式）
   */
  arc(ct:string,sd:string,lbI:string,jhi:string,cft:string,rm:string,ac:string,ruL:Array<RuModel>):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      //先查询当前用户ID
      let rc = new RcEntity();
      rc.uI=DataConfig.uInfo.uI;
      rc.sN=ct;
      rc.sd=sd;
      if(cft && cft != null && cft != ''){
        rc.ed='2999-12-31 23:59';
      }else{
        rc.ed=sd;
      }

      rc.lI=lbI;
      rc.ji=jhi;
      rc.sI=this.util.getUuid();
      let psl = new Array<PsModel>();
      console.log("----- workService arc 添加日程开始-------");
      this.baseSqlite.save(rc).then(data=>{
          console.log("----- workService arc 添加日程返回结果：" + JSON.stringify(data));
          console.log("----- workService arc 添加日程子表-------");
          return this.workSqlite.addLbData(rc.sI,rc.lI,cft,rm,ac,'0');
        })
        .then(data=>{
        if(ruL && ruL.length>0){
          //转化接口对应的参与人参数
          if(ruL && ruL.length>0){
            for(let i=0;i<ruL.length;i++){
              //排除当前登录人
              //if(ruL[i].rI != rc.uI){
              let ps = new PsModel();
              ps.userId=ruL[i].rI;
              ps.accountMobile = ruL[i].rC;
              psl.push(ps);
              //}
            }
          }
          console.log("WorkService arc() restful request " + SkillConfig.BC_SCC+" start");
          return this.rcResful.sc(rc.uI,SkillConfig.BC_SCC,rc.sI,rc.sN,rc.sd,rc.ed,rc.lI,psl,'');
        }
      }).then(data=>{
        console.log("WorkService arc() restful request end : " +JSON.stringify(data));
        if(psl.length>0 && data.code==0 && data.data.players.length>0){
          let players = data.data.players;
          for(let i=0;i<ruL.length;i++){
            for(let j=0;j<players.length;j++){
              if(ruL[i].rC == players[i].accountMobile){
                  if(players[i].agree){
                    ruL[i].sdt=1;
                    break;
                  }else if(!players[i].player){
                    ruL[i].sdt=2;
                    break;
                  }else if(!players[i].user){
                    ruL[i].sdt=3;
                    break;
                  }
              }
            }
          }
        }
        return this.workSqlite.sRcps(rc,ruL);
      }).then(data=>{
        console.log("WorkService arc() add 参与人 Success : " +JSON.stringify(data));
        //this.drc(rc.sI,'1')
        resolve(bs);
      }).catch(e=>{
        console.error("WorkService arc() Error : " +JSON.stringify(e));
        bs.code = ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })

    })
  }

  /**
   * Mq添加日程
   * @param {string} sI 主键
   * @param {string} cui 日程创建人
   * @param {string} sN 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} jhi 计划名称
   */
  arcMq(sI:string,cui:string,sN:string,sd:string,ed:string,lbI:string,cft:string,rm:string,ac:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      //先查询当前用户ID
      let rc = new RcEntity();
      rc.uI=cui;
      rc.sN=sN;
      rc.sd=sd;
      if(sd == null || sd == ''){
        rc.sd=ed;
      }
      rc.ed=ed;
      if(ed == null || ed == ''){
        rc.ed=sd;
      }
      rc.lI=lbI;
      rc.sI=sI;
      console.log("------ WorkService arcMq() Start ------------");
      this.baseSqlite.save(rc)
        .then(data=>{
          console.log("----- workService arc 添加日程返回结果：" + JSON.stringify(data));
          console.log("----- workService arc 添加日程子表-------");
          return this.workSqlite.addLbData(rc.sI,rc.lI,cft,rm,ac,'0');
        })
        .then(data=>{
        let rcp = new RcpEntity();
        rcp.uI=DataConfig.uInfo.uI;
        rcp.sI=sI;
        rcp.sa='0';
        if(rcp.uI ==rc.uI){
          rcp.sa='1';
        }
        rcp.pI=this.util.getUuid();
        rcp.sdt=1;
        rcp.son=rc.sN;
        return this.baseSqlite.save(rcp);
      }).then(data=>{
        console.log("------ WorkService arcMq() End ------------")
      }).catch(e=>{
        console.error("WorkService arcMq() Error : " +JSON.stringify(e));
        bs.code = ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })
    })
  }

  /**
   * 更新日程
   * @param {string} sI 日程主键
   * @param {string} ct 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} jhi 计划名称
   * @param {Array}  ruL 参与人json数组[ {id,rN,rC} ]（id主键,rN名称,rC联系方式）
   */
  urc(sI:string,ct:string,sd:string,ed:string,lbI:string,jhi:string,cft:string,rm:string,ac:string,ruL:Array<RuModel>):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      //先查询当前用户ID
      let rc = new RcEntity();
      rc.uI=DataConfig.uInfo.uI;
      rc.sN=ct;
      rc.sd=sd;
      if(sd == null || sd == ''){
        rc.sd=ed;
      }
      rc.ed=ed;
      if(ed == null || ed == ''){
        rc.ed=sd;
      }
      rc.lI=lbI;
      rc.ji=jhi;
      rc.sI=sI;
      let psl = new Array<PsModel>();
      this.baseSqlite.update(rc).then(datau=>{
        //转化接口对应的参与人参数
        if(ruL && ruL.length>0){
          for(let i=0;i<ruL.length;i++){
            //排除当前登录人
            //if(ruL[i].rI != rc.uI){
              let ps = new PsModel();
              ps.userId=ruL[i].rI;
              ps.accountMobile = ruL[i].rC;
              psl.push(ps);
            //}
          }
        }
        //参与人大于0则访问后台接口
        if(psl.length>0){
          console.log("WorkService urc() restful " + SkillConfig.BC_SCU+" start");
          return this.rcResful.sc(rc.uI,SkillConfig.BC_SCU,rc.sI,rc.sN,rc.sd,rc.ed,rc.lI,psl,'');
        }
      })
        .then(data=>{
          console.log("----- workService arc 更新日程返回结果：" + JSON.stringify(data));
          console.log("----- workService arc 更新日程子表-------");
          return this.workSqlite.updateLbData(rc.sI,rc.lI,cft,rm,ac,'0');
        })
        .then(data=>{
        console.log("WorkService urc() end : " +JSON.stringify(data));
        if(psl.length>0 && data.code==0 && data.data.players.length>0){
          let players = data.data.players;
          for(let i=0;i<ruL.length;i++){

            for(let j=0;j<players.length;j++){
              if(ruL[i].rC == players[i].accountMobile){
                if(players[i].agree){
                  ruL[i].sdt=1;
                  break;
                }else if(!players[i].player){
                  ruL[i].sdt=2;
                  break;
                }else if(!players[i].user){
                  ruL[i].sdt=3;
                  break;
                }
              }
            }resolve(bs);
            //先删除再添加
            this.workSqlite.dRcps(rc.sI).then(data=>{
              return this.workSqlite.sRcps(rc,ruL);
            }).then(data=>{
              resolve(bs);
            }).catch(e=>{
              console.error("WorkService arc() Error : " +JSON.stringify(e));
              bs.code = ReturnConfig.ERR_CODE;
              bs.message=e.message;
              reject(bs);
            })
          }
        }else{
          resolve(bs);
        }

      }).catch(eu=>{
        bs.code = ReturnConfig.ERR_CODE;
        bs.message=eu.message;
        resolve(bs);
      })
    })
  }


  /**
   * Mq更新日程
   * @param {string} sN 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} jhi 计划名称
   * @param {Array}  ruL 参与人json数组[ {id,rN,rC} ]（id主键,rN名称,rC联系方式）
   */
  urcMq(sI:string,cui:string,sN:string,sd:string,ed:string,lbI:string,cft:string,rm:string,ac:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      //先查询当前用户ID
      let rc = new RcEntity();
      rc.uI=cui;
      rc.sN=sN;
      rc.sd=sd;
      if(sd == null || sd == ''){
        rc.sd=ed;
      }
      rc.ed=ed;
      if(ed == null || ed == ''){
        rc.ed=sd;
      }
      rc.lI=lbI;
      rc.sI=sI;
      console.log("------ WorkService arcMq() Start ------------");
      this.baseSqlite.update(rc).then(data=>{
        let rcp = new RcpEntity();
        rcp.uI=DataConfig.uInfo.uI;
        rcp.sI=sI;
        rcp.sa='0';
        rcp.pI=this.util.getUuid();
        rcp.sdt=1;
        rcp.son=rc.sN;
        return this.baseSqlite.update(rcp);
      })
        .then(data=>{
          console.log("----- workService arc 更新日程返回结果：" + JSON.stringify(data));
          console.log("----- workService arc 更新日程子表-------");
          return this.workSqlite.updateLbData(rc.sI,rc.lI,cft,rm,ac,'0');
        })
        .then(data=>{
        console.log("------ WorkService arcMq() End ------------");
      }).catch(e=>{
        console.error("WorkService arcMq() Error : " +JSON.stringify(e));
        bs.code = ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })
    })
  }

  /**
   * 删除日程
   * @param {string} sI 日程主键
   * @param {string} sa 修改权限 0不可修改，1可修改
   */
  drc(sI:string,sa:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      if(sa == '1'){
        let rc = new RcEntity();
        rc.sI = sI;
        let ruL:Array<RuModel> = new Array<RuModel>();
        let psl = new Array<PsModel>();
        console.log('--------- 删除的日程开始 ---------')
        this.baseSqlite.delete(rc)
          .then(datad => {
            console.log('--------- 删除的日程结束 ---------')
            console.log('--------- 查询要删除的参与人开始 ---------');
            return this.relmem.getRgusBySi(sI);
        })
          .then(data => {
            if(data && data.rows && data.rows.length>0) {
              let rs = data.rows;
              for (let i = 0; i < rs.length; i++) {
                ruL.push(rs.item(i));
              }
            }
            console.log('--------- 删除的参与人开始 ---------');
          return this.workSqlite.dRcps(sI);
        })
          .then(data=>{
            console.log('--------- 删除的参与人结束 ---------');
          if(ruL && ruL.length>0){
            //转化接口对应的参与人参数
            if(ruL && ruL.length>0){
              for(let i=0;i<ruL.length;i++){
                //排除当前登录人
                //if(ruL[i].rI != rc.uI){
                let ps = new PsModel();
                ps.userId=ruL[i].rI;
                ps.accountMobile = ruL[i].rC;
                psl.push(ps);
                //}
              }
            }
            console.log("WorkService drc() 删除日程 restful request " + SkillConfig.BC_SCD+" start");
            return this.rcResful.sc(DataConfig.uInfo.uI,SkillConfig.BC_SCD,rc.sI,'123','2019-01-07','2019-01-07','1',psl,'');

          }

        })
          .then(data=>{
          resolve(bs);
        })
          .catch(eu => {
          bs.code = ReturnConfig.ERR_CODE;
          bs.message = eu.message;
          resolve(bs)
        })
      }else{
        bs.code = ReturnConfig.ERR_CODE;
        bs.message = '无权限删除';
        resolve(bs);
      }


    })
  }


  /**
   * 查询每月事件标识
   * @param ym
   * @returns {Promise<MbsoModel>}
   */
  getMBs(ym): Promise<MbsoModel> {
    return new Promise((resolve, reject) => {
      let mbso = new MbsoModel();
      console.log("----- WorkService getMBs(获取当月标识) start -----");
      this.workSqlite.getMBs(ym,DataConfig.uInfo.uI).then(data => {
        console.log("----- WorkService getMBs(获取当月标识) result:" + JSON.stringify(data));
        mbso.code = ReturnConfig.SUCCESS_CODE;
        let mbsl = new Array<MbsModel>();
        if (data.code==0&&data.data.length > 0) {
          for (let i = 0; i < data.data.length; i++) {
            let mbs = new MbsModel();
            mbs.date = new Date(data.data[i].ymd);
            if (data.data[i].ct > 5) {
              mbs.im = true;
            }
            if (data.data[i].mdn != null) {
              mbs.iem = true;
            }
            mbsl.push(mbs)
          }
        }
        mbso.bs = mbsl;
        resolve(mbso);
      }).catch(e => {
        console.error("----- WorkService getMBs(获取当月标识) Error:" + JSON.stringify(e));
        mbso.code = ReturnConfig.ERR_CODE;
        mbso.message = e.message;
        reject(mbso);
      })
    })
  }

  /**
   * 查询当天事件
   * @param d 'yyyy-MM-dd'
   */
  getOd(d:string):Promise<RcpoModel>{
    return new Promise((resolve, reject) =>{
      let rcpo = new RcpoModel();
      console.log("----- WorkService getOd(获取当天事件) start -----");
      this.workSqlite.getOd(d,DataConfig.uInfo.uI).then(data=>{
        console.log("----- WorkService getOd(获取当天事件) result:" + JSON.stringify(data));
        let rcps = new Array<ScheduleModel>();
        if(data.code==0 &&data.data.length>0){
          for(let i=0;i<data.data.length;i++){
            let rcp = new ScheduleModel();
            rcp = data.data[i];
            rcps.push(rcp);
          }
        }
        rcpo.slc = rcps;
        resolve(rcpo);
      }).catch(e=>{
        console.error("----- WorkService getOd(获取当天事件) Error:" + JSON.stringify(e));
        rcpo.code=ReturnConfig.ERR_CODE;
        rcpo.message=e.message;
        reject(rcpo)
      })
    })
  }

  /**
   * 根据条件查询日程
   * @param {string} ct 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} lbN 标签名称
   * @param {string} jh 计划名称
   */
  getwL(ct:string,sd:string,ed:string,lbI:string,lbN:string,jh:string):Promise<RcoModel>{
    return new Promise((resolve, reject) =>{
      let rco = new RcoModel();
      console.log("----- WorkService getwL(根据条件查询日程) start -----");
      this.workSqlite.getwL(ct,sd,ed,lbI,lbN,jh).then(data=>{
        console.log("----- WorkService getwL(根据条件查询日程) result:" + JSON.stringify(data));
        let rcs = new Array<RcModel>()
        if(data && data.rows && data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            let rc = new RcModel();
            rc = data.rows.item(i);
            rcs.push(rc);
          }
        }else{
          rco.code=ReturnConfig.NULL_CODE;
          rco.message=ReturnConfig.NULL_MESSAGE;
        }
        rco.rcL=rcs;
        resolve(rco);
      }).catch(e=>{
        console.error("----- WorkService getwL(根据条件查询日程) Error:" + JSON.stringify(e));
        rco.code=ReturnConfig.ERR_CODE;
        rco.message=e.message;
        reject(rco);
      })
    });
  }

  /**
   * 事件详情
   * @param {string} pI 日程ID
   * @returns {Promise<RcpModel>}
   */
  getds(sI:string):Promise<RcModel>{
    return new Promise((resolve, reject) =>{
      let rc= new RcModel();
      console.log("----- WorkService getds(事件详情) start -----");
      this.workSqlite.getds(sI).then(data=>{
        console.log("----- WorkService getds(事件详情) result:" + JSON.stringify(data));
          if(data&&data.rows&&data.rows.length>0){
            rc= data.rows.item(0);
          }else{
            rc.code=ReturnConfig.NULL_CODE;
            rc.message=ReturnConfig.NULL_MESSAGE;
          }
          return this.relmem.getRgusBySi(sI);
      }).then(data=>{
        if(data && data.rows && data.rows.length>0){
          let rs=data.rows;
          let rus = new Array<RuModel>();
          for(let i=0;i<rs.length;i++){
            let ru = new RuModel();
            if(rs.item(i).uI == rc.uI){
              ru.rN=DataConfig.uInfo.uN;
              ru.ran=DataConfig.uInfo.uN;
              ru.rI=DataConfig.uInfo.uI;
              ru.hiu=DataConfig.uInfo.hIU;
            }else{
              ru = rs.item(i);
            }
            rus.push(ru);
          }
          rc.rus = rus;
        }
        resolve(rc);
      }).catch(e=>{
        console.error("----- WorkService getds(事件详情) Error:" + JSON.stringify(e));
        rc.code=ReturnConfig.ERR_CODE;
        rc.message=ReturnConfig.ERR_MESSAGE;
        reject(rc);
      })
    });
  }

  /**
   * MQ删除日程
   * @param {string} sI 主键
   * @returns {Promise<BsModel>}
   */
  delrc(sI:string):Promise<BsModel> {
    return new Promise((resolve, reject) => {
      let rc = new RcEntity();
      rc.sI=sI;
      let bs = new BsModel();
      console.log("----- WorkService delrc(删除日程) start -----");
      //先查询日程
      this.baseSqlite.getOne(rc)
      .then(data=>{
        if(data && data.rows && data.rows.length>0){
          //插入message表
          let ms = new MsEntity();
          ms.mn=data.rows.item(0).sN;
          ms.md=data.rows.item(0).sd;
          ms.mt='0';
          return this.msSqlite.addMs(ms);
        }
      })
        .then(data=>{
          //删除日程
        return this.baseSqlite.delete(rc);
      })
        .then(data=>{
          console.log("----- WorkService delrc(删除日程) result:" + JSON.stringify(data));
          console.log('--------- 删除的参与人开始 ---------');
          return this.workSqlite.dRcps(sI);
      }).then(data=>{
        console.log('--------- 删除的参与人结束 ---------');
        resolve(bs);
      })
        .catch(e=>{
        console.error("----- WorkService delrc(删除日程) Error:" + JSON.stringify(e));
        bs.code=ReturnConfig.ERR_CODE;
        bs.message=e.message;
      })
    })
  }

  /**
   * 查询标签
   */
  getlbs():Promise<LboModel>{
    return new Promise((resolve, reject) =>{
      let lbo = new LboModel();
      this.lbSqlite.getlbs().then(data=>{
        let lbs = new Array<LbModel>();
        if(data && data.rows && data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            let lb = new LbModel();
            lb = data.rows.item(i);
            lbs.push(lb);
          }
        }
        lbo.lbs=lbs;
        resolve(lbo);
      }).catch(e=>{
        lbo.code=ReturnConfig.ERR_CODE;
        lbo.message=e.message;
        reject(lbo);
      })
    });
  }

  /**
   *
   * @returns {Promise<LboModel>}
   */
  xfAddrc(sn:string,st:string,py:string,ca:string,cb:string):Promise<RcModel>{
    return new Promise((resolve, reject) =>{
      let rc = new RcModel();
      rc.sN=sn;
      rc.sd=st;
      let nopy=py; //不存在的联系人
      let ruL = new Array<RuModel>();
      console.log("---------- WorkService 讯飞语音添加日程 Start ------------");
      console.log("  ------ WorkService 讯飞语音添加日程: 匹配参与人 ----");
      this.relmem.xfGetRu(py).then(data=>{
        console.log("  ------ WorkService 讯飞语音添加日程: 匹配参与人查询结果：" + JSON.stringify(data));
          if(data && data.rows&&data.rows.length>0){
            //获取不存在的联系人 pinyin名称
            for(let i=0;i<data.rows.length;i++){
              let ru:RuModel = data.rows.item(i);
              ruL.push(ru);
              let npy = '';
              let istrue = false;
              if(ru.ran && ru.ran != null && ru.ran != ''){
                npy = this.util.chineseToPinYin(ru.ran);
                nopy = nopy.replace(npy,'');
                istrue = true;
              }
              if(!istrue&&ru.rN && ru.rN != null && ru.rN != ''){
                npy = this.util.chineseToPinYin(ru.rN);
                nopy = nopy.replace(npy,'');
              }
            }
          }

          let nopyL:Array<string> = nopy.split(",");
          let caL = ca.split(",");
          let cbL = cb.split(",");
          let noca='';//获取不存在的联系人中文名称
          let nocb='';//获取不存在的联系人 解析中文名称
          for(let j=0;j<nopyL.length;j++){
            for(let a=0;a<caL.length;a++){
              let capy = this.util.chineseToPinYin(caL[a]);
              if(nopyL[j] == capy){
                if(noca == ''){
                  noca = caL[a];
                }else{
                  noca = "," + caL[a];
                }
              }
            }
            for(let b=0;b<cbL.length;b++){
              let cbpy = this.util.chineseToPinYin(cbL[b]);
              if(nopyL[j] == cbpy){
                if(nocb == ''){
                  nocb = caL[b];
                }else{
                  nocb = "," + caL[b];
                }
              }
            }
          }
        rc.rus=ruL;
        rc.noca=noca;
        rc.nocb=nocb;
        resolve(rc)
      }).catch(e=>{
        console.error("-------- WorkService 讯飞语音添加日程 ERROR : " + JSON.stringify(e));
        rc.code=ReturnConfig.ERR_CODE;
        rc.message=ReturnConfig.ERR_MESSAGE;
        reject(rc)
      })

    })

  }
}
