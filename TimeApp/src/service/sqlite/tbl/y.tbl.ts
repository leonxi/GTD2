import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class YTbl implements ITbl {

  private _yi: string="";
  private _yt: string="";
  private _ytn: string="";
  private _yn: string="";
  private _yk: string="";
  private _yv: string="";


  get yi(): string {
    return this._yi;
  }

  set yi(value: string) {
    this._yi = value;
  }

  get yt(): string {
    return this._yt;
  }

  set yt(value: string) {
    this._yt = value;
  }

  get ytn(): string {
    return this._ytn;
  }

  set ytn(value: string) {
    this._ytn = value;
  }

  get yn(): string {
    return this._yn;
  }

  set yn(value: string) {
    this._yn = value;
  }

  get yk(): string {
    return this._yk;
  }

  set yk(value: string) {
    this._yk = value;
  }

  get yv(): string {
    return this._yv;
  }

  set yv(value: string) {
    this._yv = value;
  }

  cT(): string {

    let sq = 'create table if not exists gtd_y(  yi varchar(50) primary key ,yt varchar(20)  ,' +
      'ytn varchar(20)  ,yn varchar(20)  ,yk varchar(20)  ,yv varchar(400)   );';

    return sq;
  }

  upT(): string {
    let sq = '';
    if (this._yt != null && this._yt!="") {
      sq = sq + ', yt="' + this._yt + '"';
    }
    if (this._ytn != null && this._ytn!="") {
      sq = sq + ', ytn="' + this._ytn + '"';
    }
    if (this._yn != null && this._yn!="") {
      sq = sq + ', yn="' + this._yn + '"';
    }
    if (this._yk != null && this._yk!="") {
      sq = sq + ', yk="' + this._yk + '"';
    }
    if (this._yv != null && this._yv!="") {
      sq = sq + ', yv="' + this._yv + '"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_y set  ' + sq + ' where yi = "' + this._yi + '";';
    return sq;
  }

  dT(): string {
    let sq = 'delete from gtd_y where 1=1 ';
    if(this._yi != null && this._yi!=""){
      sq = sq + 'and  yi ="' + this._yi +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT(): string {
    let sq = 'select * from gtd_y where yi = "' + this._yi + '";';
    return sq;
  }

  slT(): string {
    let sq = 'select * from  gtd_y where  1=1 ';
    if (this._yt != null && this._yt!="") {
      sq = sq + ' and yt="' + this._yt + '"';
    }
    if (this._ytn != null && this._ytn!="") {
      sq = sq + ' and ytn="' + this._ytn + '"';
    }
    if (this._yn != null && this._yn!="") {
      sq = sq + ' and yn="' + this._yn + '"';
    }
    if (this._yk != null && this._yk!="") {
      sq = sq + ' and yk="' + this._yk + '"';
    }
    if (this._yv != null && this._yv!="") {
      sq = sq + ' and yv="' + this._yv + '"';
    }
    sq = sq +';'
    return sq;
  }

  drT(): string {

    let sq = 'drop table if exists gtd_y;';
    return sq;
  }

  inT(): string {

    let sq = 'insert into gtd_y ' +
      '(  yi ,yt ,ytn ,yn ,yk ,yv) values("' + this._yi + '","' + this._yt + '","' + this._ytn + '"' +
      ',"' + this._yn + '","' + this._yk + '","' + this._yv + '");';

    return sq;
  }

  rpT(): string {

    let sq = 'replace into gtd_y ' +
      '(  yi ,yt ,ytn ,yn ,yk ,yv) values("' + this._yi + '","' + this._yt + '","' + this._ytn + '"' +
      ',"' + this._yn + '","' + this._yk + '","' + this._yv + '");';

    return sq;
  }

}

