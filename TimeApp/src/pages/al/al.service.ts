import {Injectable} from "@angular/core";
import {PageConfig} from "../../app/page.config";
import {DataConfig} from "../../app/data.config";
import {PermissionsService} from "../../service/util-service/permissions.service";

@Injectable()
export class AlService {


  constructor(private permissionsService: PermissionsService,) {
  }

  //权限申请
  checkAllPermissiions():Promise<any>{
    return this.permissionsService.checkAllPermissiions();
}

  //数据库连接

  a():Promise<any>{

  }

  //判断是否初始化完成

  //创建数据库表,初始化系统数据,初始化数据完成写入

  //

  //

  //系统设置

  //判断用户是否登陆





  initSystem():Promise<any> {
    this.xiaojiFeekback.initAudio();
    //全局网络监控
    this.networkService.monitorNetwork();
    console.log("权限申请开始");
    this.permissionsService.checkAllPermissiions()
      .then(res => {
        this.text="权限申请完成";
        console.log("权限申请完成");
        //初始化创建数据库
        this.text=" 初始化创建数据库开始";
        console.log("al :: 初始化创建数据库开始");
        this.increment(10);
        console.log("al :: 初始化https协议开始");
        this.bsRestful.init();
        return this.configService.initDataBase();
      })
      .then(data => {
        console.log("al :: 初始化创建数据库结束");
        console.log("al :: 初始化https协议结束");
        console.log("al :: 游客登录开始");
        this.increment(10);
        //游客登陆
        return this.lsm.visitor()
      })
      .then(data => {
        console.log("al :: 游客登录结束，获取登录信息:"+JSON.stringify(DataConfig.uInfo));
        //初始化本地变量
        this.text=" 初始化本地变量";
        console.log("al :: 初始化本地变量开始");
        this.increment(10);
        return this.sync.initzdlb()
      })
      .then(data => {
        console.log("al :: 初始化本地变量结束");
        //同步服务器
        console.log("al :: 同步服务器开始");
        this.text=" 同步服务器";
        this.increment(10);
      })
      .then(data => {
        console.log("al :: 同步服务器结束");
        //同步本地日历
        //   console.log("al :: 导入用户本地日历开始");
        //   this.text=" 导入本地日程";
        //   this.increment(10);
        //   return this.readlocal.uploadLocal();
        // })
        // .then(data => {
        //   console.log("al :: 导入用户本地日历结束");
        //初始化本地参数
        console.log("al :: 初始化本地参数开始")
        this.increment(10);
        return this.sync.initLocalData()
      }).then(data => {
      console.log("al :: 初始化本地参数结束")
      //连接webSocket
      console.log("al :: 开始连接webSocket");
      return this.webSocketService.connect(DataConfig.uInfo.aQ);
    }).then(data => {
      console.log("al :: 连接websockte成功")
      this.increment(10);
      //检车websockte的状态
      console.log("al :: 查询联系人开始");
      if(DataConfig.uInfo.uty == '1' && DataConfig.IS_MOBILE){
        return this.ContactsService.getContacts();
      }
    }).then(data=>{
      console.log("al :: 查询联系人成功");
    }).then(data=>{
      console.log("al :: 开始更新版本表");
      return this.configService.ufi(null,0)
    }) .then(data => {
      console.log("al :: 开始更新版本表结束");
      if(DataConfig.uInfo.uty=='1'){
        //定时同步
        console.log("al :: 定时同步");
        this.sync.syncTime();
      }
      console.log("al ::定时查询闹铃");
      this.work.setColckWork();
    }).then(data => {
      //进入主页
      //loading.dismiss();
      console.log("al :: 进入主页");
      this.increment(10);
      this.text=" 进入主页";
      this.nav.setRoot(this.rootPage);

    }).catch(res => {
      console.log("al error :: "+JSON.stringify(res));
      //loading.dismiss();
      this.nav.setRoot(this.rootPage);
    })


    //   //
    //   //
    //   // 查询版本
    //   this.fisqlite.getfi(1).then(data=>{
    //     let istrue:boolean = false
    //     if(data && data.rows && data.rows.length>0){
    //       if(data.rows.item(0).isup==1){
    //         istrue=true;
    //         this.fisqlite.ufi(null,0)
    //       }
    //     }else{
    //       istrue=true;
    //       this.fisqlite.afi(1,0)
    //     }
    //     //如果发现最新更新则跳转引导页
    //     if(istrue){
    //       this.uploadLocal();
    //       loading.dismiss();
    //       this.nav.setRoot(this.rootPage);
    //
    //     }else{
    //       //获取Token
    //       this.userSqlite.getUo().then(data=>{
    //         // AppConfig.Token=data.u.uT;
    //         if(data && data.u && data.u.uT && data.u.uT !='null' && data.u.uT !=''){
    //           AppConfig.Token=data.u.uT;
    //           console.debug('MyApp初始化Token'+AppConfig.Token)
    //         }
    //         console.debug(JSON.stringify(data))
    //         loading.dismiss();
    //         this.nav.setRoot(this.rootPage);
    //       }).catch(e=>{
    //         alert("MyApp获取Token失败")
    //         console.error("MyApp获取Token失败"+e.message)
    //         loading.dismiss();
    //         this.nav.setRoot(this.rootPage);
    //       })
    //
    //     }
    //
    //   }).catch(e=>{
    //     // alert("MyApp查询版本号失败")
    //     //首次打开App,初始化创建数据库建表
    //     this.baseSqlite.createTable();
    //     this.rootPage = PageConfig.M_PAGE;
    //     this.events.subscribe('db:create', () => {
    //       //创建数据库与表成功
    //
    //     })
    //
    //     this.uploadLocal().then(data=>{
    //
    //     }).catch(reason => {
    //
    //     });
    //
    //   })
    //
    // }
    //
    // init() {
    //   //查询版本
    //   this.fisqlite.getfi(1).then(data => {
    //     let istrue: boolean = false;
    //     if (data && data.rows && data.rows.length > 0) {
    //       if (data.rows.item(0).isup == 1) {
    //         istrue = true;
    //         this.fisqlite.ufi(null, 0)
    //       }
    //     } else {
    //       istrue = true;
    //       this.fisqlite.afi(1, 0)
    //     }
    //     //如果发现最新更新则跳转引导页
    //     if (istrue) {
    //       this.rootPage = PageConfig.AZ_PAGE;
    //     } else {
    //       //获取Token
    //       this.user.getUo().then(data => {
    //         // AppConfig.Token=data.u.uT;
    //         if (data && data.u && data.u.uT && data.u.uT != 'null' && data.u.uT != '') {
    //           AppConfig.Token = data.u.uT;
    //           console.debug('MyApp初始化Token' + AppConfig.Token)
    //         }
    //         console.debug(JSON.stringify(data))
    //       }).catch(e => {
    //         alert("MyApp获取Token失败");
    //         console.error("MyApp获取Token失败" + e.message)
    //       });
    //       this.rootPage = PageConfig.M_PAGE;
    //     }
    //     this.nav.setRoot(this.rootPage);
    //   }).catch(e => {
    //     // alert("MyApp查询版本号失败")
    //     //首次打开App,初始化创建数据库建表
    //     this.baseSqlite.createTable();
    //     this.rootPage = PageConfig.AZ_PAGE;
    //     this.nav.setRoot(this.rootPage);
    //
    //   })
    // }
    //
    // ngAfterViewInit() {
    //   //确保异步执行完后才隐藏启动动画
    //   this.events.subscribe('db:create', () => {
    //     //创建数据库与表成功后才关闭动画跳转页面
    //     this.statusBar.styleDefault();
    //     this.splashScreen.hide();
    //   });
    //   //初始化创建数据库
    //   this.baseSqlite.createDb();
    // }

  }
}
