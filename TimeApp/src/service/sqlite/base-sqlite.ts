import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { Platform , Events } from 'ionic-angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import * as moment from "moment";
import {UEntity} from "../../entity/u.entity";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";
import {RuEntity} from "../../entity/ru.entity";
import {LbEntity} from "../../entity/lb.entity";
import {ReEntity} from "../../entity/re.entity";
import {StEntity} from "../../entity/st.entity";
import {ZtEntity} from "../../entity/zt.entity";
import {ZtdEntity} from "../../entity/ztd.entity";
import {MsEntity} from "../../entity/ms.entity";
import {RguEntity} from "../../entity/rgu.entity";
import {JhEntity} from "../../entity/jh.entity";
import {FiEntity} from "../../entity/fi.entity";
import {UtilService} from "../util-service/util.service";
import {BsModel} from "../../model/out/bs.model";

/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class BaseSqlite {
  className:String = 'BaseSqlite';
  database: SQLiteObject;
  win: any = window;//window对象
  constructor( private platform: Platform,
               private sqlite: SQLite,
               private util: UtilService,
               private sqlitePorter: SQLitePorter,
               private events: Events) { }
  /**
   * 创建数据库
   */
  createDb(): Promise<BsModel> {
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      console.debug(this.className + " start create Db mingWX.db")
      if (this.isMobile()) {
        this.sqlite.create({
          name: 'mingWX.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          console.debug(this.className + " create Db success")
          this.database = db;
          resolve(bs)
        }).catch(e => {
          console.debug(this.className + " create Db fail：" + e.message)
          this.events.publish('db:create');
          bs.code=1
          resolve(bs);
        });
      } else {
        //H5数据库存储
        this.database = this.win.openDatabase("data.db", '1.0', 'database', 5 * 1024 * 1024);//声明H5 数据库大小
        console.debug(this.className + " create Db success")
        resolve(bs)
      }
      //alert('创建数据成功！')
    });
  }

  /**
   * 查询FI表是否存在
   * @returns {Promise<BsModel>}
   */
  isFi(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        let sql="SELECT * FROM GTD_FI where id=1";
        this.executeSql(sql,[]).then(data=>{
          if(data && data.row && data.row.length()>0&& data.rows.item(0).isup == 0){
            console.debug(this.className + " fi is exist")
            resolve(true)
          }else{
            console.error(this.className + " fi is not exist")
            resolve(false)
          }
        }).catch(e=>{
          console.error(this.className + " fi is not exist:" + e.message)
          resolve(false)
        })
    })
  }

  /**
   * 创建表
   */
  async createTable() {
    console.debug(this.className+"数据库初始化建表开始")
    //可能存在多个执行创建表语句，只需最后一个使用await
    //this.executeSql('DROP TABLE GTD_ACCOUNT',[]);
    //创建用户基本信息表
    let ue=new UEntity();
    this.executeSql(ue.csq,[]).then(data=>{
      let u:UEntity=new UEntity();
      u.uI=this.util.getUuid();
      u.uty='0';
      this.save(u);
    }).catch(e=>{
      console.log('createTable：GTD_A:'+e.toString());
    })
    //创建日程表
    let rc = new RcEntity();
    this.executeSql(rc.csq,[]).catch(e=>{
      console.log('GTD_C:'+e.toString());
    })

    //创建日程参与人表
    let rcp = new RcpEntity();
    this.executeSql(rcp.csq,[]).catch(e=>{
      console.log('GTD_D:'+e.toString());
    })
    //授权联系人表
    let ru = new RuEntity();
    this.executeSql(ru.csq,[]).catch(e=>{
      console.log('GTD_B:'+e.toString());
    })
    //群组关联人
    let rgu = new RguEntity();
    this.executeSql(rgu.csq,[]).catch(e=>{
      console.log('GTD_B_X:'+e.toString());
    })
    //标签表
    let lb = new LbEntity();
    // this.executeSql(lb.drsq,[]).catch(e=>{
    //   console.log('GTD_F:'+e.toString());
    // })
    this.executeSql(lb.csq,[]).catch(e=>{
      console.log('GTD_F:'+e.toString());
    })

    // 提醒时间表
    let re = new ReEntity();
    this.executeSql(re.csq,[]).catch(e=>{
      console.log('GTD_E:'+e.toString());
    })
    // 系统设置表
    let st = new StEntity();
    this.executeSql(st.csq,[]).catch(e=>{
      console.log('GTD_G:'+e.toString());
    })
    // massage
    let ms = new MsEntity();
    this.executeSql(ms.csq,[]).catch(e=>{
      console.log('GTD_H:'+e.toString());
    })
    // 字典类型表
    let zt = new ZtEntity();
    this.executeSql(zt.csq,[]).catch(e=>{
      console.log('GTD_X:'+e.toString());
    })
    // 字典数据表
    let ztd = new ZtdEntity();
    this.executeSql(ztd.csq,[]).catch(e=>{
      console.log('GTD_Y:'+e.toString());
    })
    // 计划表
    let jh = new JhEntity();
    this.executeSql(jh.csq,[]).catch(e=>{
      console.log('GTD_J_H:'+e.toString());
    })
    // 版本表
    let fi = new FiEntity();
    this.executeSql(fi.csq,[]).then(data=>{
      fi.id=1;
      fi.firstIn=1;
      fi.isup=0
      this.save(fi);
    }).catch(e=>{
      console.log('GTD_FI:'+e.toString());
    })
    let sql = new UEntity().csq+ new RcEntity().csq + new RcpEntity().csq +new RuEntity().csq
                  + new LbEntity().csq+new ReEntity().csq+ new StEntity().csq+ new MsEntity().csq
                  + new ZtEntity().csq+new ZtdEntity().csq+new JhEntity().csq+new RguEntity().csq
                  +new FiEntity().csq;
    //this.importSqlToDb(sql);
    let data = new Array();
    this.initlb(data);
    console.debug(this.className+"数据库初始化建表结束")
   // alert('初始化建表结束！')
  }


  /**
   * 批量语句
   */
  importSqlToDb(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then((count) => {
          console.log('Imported');
          alert("Imported" + count);
          resolve(count);
        })
        .catch((error)=> {
          console.error(error);
          alert(this.className+"sql执行错误:"+error.message);
          reject(error)
        });
    });
  }

  /**
   * 执行语句
   */
  executeSql(sql: string, array: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database.transaction(function(tx) {
        tx.executeSql(sql, array,  (tx, res)=>{
          resolve(res);
        }, (tx, err) =>{
          console.log('error: ' + err.message);
          console.log("sql: "+sql)
          reject(err);
        });
      });

    });
  }


  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile():boolean{
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 保存
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  save(et:any){
    return this.executeSql(et.isq,[])
  }
  /**
   * 更新
   */
  update(et:any){
    return this.executeSql(et.usq,[])

  }

  /**
   * 删除
   * @param param
   * @returns {Promise<any>}
   */
  delete(et:any){
    return this.executeSql(et.dsq,[])
  }

  /**
   * 根据ID查询
   * @param t
   * @returns {Promise<T>}
   */
  getOne(et:any){
    return this.executeSql(et.qosq,[])
  }

  /**
   * 生成本地测试日历数据
   */
  addRctest(): Promise<any> {
    let sql = "";

    let ii = 1;
    let mo = moment();
    return new Promise((resolve, reject) => {

      while (ii < 3000) {


        mo = mo.add(5, "h");

        sql = sql + "INSERT INTO GTD_D(pI,son,uI) " +
          "VALUES ( '" + mo.format("YYYY-MM-DD hh:mm:ss SSS") + "','加上5个小时');";
        ii += 1;
      }


      mo = moment();
      ii= 0;
      while (ii < 3000) {


        mo = mo.subtract(5, "h");
        sql = sql + "INSERT INTO GTD_D(pI,son,uI) " +
          "VALUES ( '" + mo.format("SSS YYYY-MM-DD hh:mm:ss") + "','减去5个小时');";
        ii += 1;
      }

      this.importSqlToDb(sql,).then((data) => {
        resolve("添加完成，总数据量为：" + ii);
      }).catch((err) => {
          resolve(err.toString());
        }
      )


    })
  }
  initlb(data:any){
    data.push({lai:'BQA01',lat:'BQA',lan:'任务'});
    data.push({lai:'BQB01',lat:'BQB',lan:'生活'})
    data.push({lai:'BQB02',lat:'BQB',lan:'工作'})
    data.push({lai:'BQC01',lat:'BQC',lan:'聚会'})
    data.push({lai:'BQC02',lat:'BQC',lan:'会议'})
    data.push({lai:'BQC03',lat:'BQC',lan:'事件'})
    data.push({lai:'BQC04',lat:'BQC',lan:'预约'})
    data.push({lai:'BQC05',lat:'BQC',lan:'运动'})
    data.push({lai:'BQD01',lat:'BQD',lan:'特殊日期'})
    data.push({lai:'BQD02',lat:'BQD',lan:'法定假日'})
    data.push({lai:'BQE01',lat:'BQE',lan:'里程碑'})
    data.push({lai:'BQE02',lat:'BQE',lan:'随手记'})
    data.push({lai:'BQE03',lat:'BQE',lan:'记账'})

    for(let i=0;i<data.length;i++){
      /*let sql = 'insert into GTD_F (lai,lan,lat) select "'+ data[i].lai +'","'+ data[i].lan +'","'+ data[i].lat +'" ' +
        'where not exists (select lai,lan,lat from GTD_F)'
      this.executeSql(sql,[]).then(data=>{
        console.log(data)
      }).catch(e=>{
        console.log(e.message)
      })*/
      let lb=new LbEntity();
      lb.lai = data[i].lai;
      lb.lan = data[i].lan;
      lb.lat=data[i].lat;
      this.save(lb);
    }
  }

}
