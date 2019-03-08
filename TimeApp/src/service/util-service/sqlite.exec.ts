import {Injectable} from "@angular/core";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {UtilService} from "../util-service/util.service";
import {SqliteConfig} from "../config/sqlite.config";
import {ITbl} from "../sqlite/tbl/itbl";

/**
 * create by on 2019/3/5
 */

@Injectable()
export class SqliteExec {


  constructor(private sqlliteConfig: SqliteConfig, private sqlitePorter: SQLitePorter,
              private util: UtilService) {
  }

  /**
   * 执行语句
   */
  execSql(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlliteConfig.database.transaction(function (tx) {
        tx.executeSql(sql, [], (tx, res) => {
          resolve(res);
        }, (tx, err) => {
          console.log('error: ' + err.message);
          console.log("sql: " + sql);
          reject(err);
        });
      });

    });
  }

  /**
   * 创建表
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  create(itbl: ITbl) {
    return this.execSql(itbl.cT());
  }

  /**
   * 删除表
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  drop(itbl: ITbl) {
    return this.execSql(itbl.drT())
  }

  /**
   * 保存
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  save(itbl: ITbl) {
    return this.execSql(itbl.inT())
  }

  /**
   * 更新
   */
  update(itbl: ITbl) {
    return this.execSql(itbl.upT())

  }

  /**
   * 删除
   * @param param
   * @returns {Promise<any>}
   */
  delete(itbl: ITbl) {
    return this.execSql(itbl.dT())
  }

  /**
   * 查询
   * @param t
   * @returns {Promise<T>}
   */
  getList(itbl: ITbl) {
    return this.execSql(itbl.slT())
  }

  /**
   * 根据ID查询
   * @param t
   * @returns {Promise<T>}
   */
  getOne(itbl: ITbl) {
    return this.execSql(itbl.sloT());
  }

  /**
   * 表数据替换
   * @param t
   * @returns {Promise<T>}
   */
  replaceT(itbl: ITbl) {
    return this.execSql(itbl.rpT())
  }

  async batExecSql(sqlist: Array<string>) {
    if (this.util.isMobile()) {
      let sql: string;
      for (var j = 0, len = sqlist.length; j < len; j++) {
        sql = sql + sqlist[j];
      }
      return this.sqlitePorter.importSqlToDb(this.sqlliteConfig.database, sql)

    } else {
      let count = 0;
      for (var j = 0, len = sqlist.length; j < len; j++) {
        if (sqlist[j] != null && sqlist[j] != '') {
          count++;
          await this.execSql(sqlist[j]);
        } else {
          //console.error("sqls["+i+"]: ("+sqls[i]+ "） ;sqlAll:"+sql);
        }
      }
      return count;
    }
  }
}