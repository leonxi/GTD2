/**
 * create by on 2018/11/19
 */

//日程子表-纪念日标签（特殊日期,法定假日）
export class RcbModel {

  private _sI:string='';   //UUID
  private _id:string=''; //主键
  private _tk:string='';  //标签key值
  private _cf:string='';  //是否重复：0否1是
  private _cft:string=''; //重复类型：0日，1周，2月，3年
  private _dt:string=''; //自定义提醒时间
  private _wd:string = ''; //完成时间
  private _rm:string=''; //备注
  private _ac:string=''; //提醒方式
  private _fh:string=''; //是否完成0否1是
  private _tn:string = null; // 表名
  private _rpsq:string='';
  private _dsq:string='';

  get rpsq(): string {
    return this._rpsq;
  }

  set rpsq(value: string) {
    if(this._tn != null && this._tn !=''&& this._id !=null && this._id !=''){
      let sql='replace into '+ this._tn +
        ' (sI,id,tk,cf,cft,dt,wd,rm,ac,fh) values("'+ this._sI+'","'+ this._id+'","'+this._tk+ '","'+ this._cf
        +'","'+this._cft+ '","'+ this._dt+'","'+ this._wd+'","'+ this._rm+'","'+ this._ac+'","'+ this._fh+'")';
      this._rpsq=sql;
    }

    this._rpsq = value;
  }

  get dsq(): string {
    if(this._tn != null && this._tn !=''&& this._id != null && this._id!=''){
      let sql='DELETE FROM '+ this._tn +' WHERE 1=1 ';
      if(this._sI!=null){
        sql=sql+' and sI="' + this._sI +'"';
      }
      if(this._id!=null){
        sql=sql+' and id="' + this._id +'"';
      }
      if(this._tk!=null){
        sql=sql+' and tk="' + this._tk +'"';
      }
      if(this._cf!=null){
        sql=sql+' and cf="' + this._cf +'"';
      }
      if(this._cft!=null){
        sql=sql+' and cft="' + this._cft +'"';
      }
      if(this._wd!=null){
        sql=sql+' and wd="' + this._wd +'"';
      }
      if(this._rm!=null){
        sql=sql+' and rm="' + this._rm +'"';
      }
      this._dsq=sql;
    }

    return this._dsq;
  }

  set dsq(value: string) {
    this._dsq = value;
  }

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get tn(): string {
    return this._tn;
  }

  set tn(value: string) {
    this._tn = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get tk(): string {
    return this._tk;
  }

  set tk(value: string) {
    this._tk = value;
  }

  get cf(): string {
    return this._cf;
  }

  set cf(value: string) {
    this._cf = value;
  }


  get cft(): string {
    return this._cft;
  }

  set cft(value: string) {
    this._cft = value;
  }

  get wd(): string {
    return this._wd;
  }

  set wd(value: string) {
    this._wd = value;
  }

  get rm(): string {
    return this._rm;
  }

  set rm(value: string) {
    this._rm = value;
  }

  get dt(): string {
    return this._dt;
  }

  set dt(value: string) {
    this._dt = value;
  }

  get ac(): string {
    return this._ac;
  }

  set ac(value: string) {
    this._ac = value;
  }

  get fh(): string {
    return this._fh;
  }

  set fh(value: string) {
    this._fh = value;
  }
}