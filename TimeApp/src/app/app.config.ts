
/**
 * Generated class for the ScheduleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 *
 * 请求路径类
 * create by wzy on 2018/05/24
 */

export class AppConfig {

  /* 环境URL 头部 */
   private static REQUEST_URL: string = "http://www.guobaa.com/gtd";
  // private static REQUEST_URL: string = "http://192.168.99.35:8080/gtd";//连接本地数据库

  /* RabbitMq WebSocket */
  public static RABBITMQ_WS_URL: string = "ws://www.guobaa.com/ws";
  // public static RABBITMQ_WS_URL: string = "ws://192.168.0.219:15674/ws";


  /* RabbitMq SockJs */
  public static RABBITMQ_SJ_URL: string = "http://192.168.0.219:15674/stomp";

  /* 请求头 OPTIONS*/
  public static HEADER_OPTIONS_JSON: any = {
    headers: {
      "Content-Type": "application/json"
    },
    responseType: 'json'
  };

  /* Controller */
  private static USER_URL: string = AppConfig.REQUEST_URL + "/user";    //用户类

  private static GROUP_URL: string = AppConfig.REQUEST_URL + "/group";   //群组类

  private static SCHEDULE_URL: string = AppConfig.REQUEST_URL + "/schedule";    //日程类

  private static WEB_SOCKET_URL: string = AppConfig.REQUEST_URL + "/push";    //webSocket推送

  private static XIAOJIVOICE_URL: string = AppConfig.REQUEST_URL + "/xiaoji";    // 讯飞语音

  /* Connect */
  //用户类
  public static USER_LOGIN_URL: string = AppConfig.USER_URL + "/login";   //登陆 POST

  public static USER_REGISTER_URL: string = AppConfig.USER_URL + "/register";   //注册 POST

  public static USER_LABEL_URL: string = AppConfig.USER_URL + "/find_label";           //查询标签

  public static USER_UPDATE_PASSWORD_URL: string = AppConfig.USER_URL + "/update_password";           //修改密码

  public static USER_UPDATE_INFO_URL: string = AppConfig.USER_URL + "/update_userinfo";           //修改资料

  //群组类
  public static GROUP_FIND_URL: string = AppConfig.GROUP_URL + "/find_all";    //全部群组查询 POST

  public static GROUP_ADD_GROUP_URL: string = AppConfig.GROUP_URL + "/add_group"; //新增群组 post

  public static GROUP_FIND_SINGLE_URL: string = AppConfig.GROUP_URL + "/find_single";    //群组详情查询 POST

  public static GROUP_FIND_GROUPMEMBER_URL: string = AppConfig.GROUP_URL + "/find_group_member";    //查询群成员全部 POST

  public static GROUP_ADD_DEL_URL: string = AppConfig.GROUP_URL + "/add_del_member";    //群组添加 POST

  public static GROUP_UPDATE_GROUP_URL: string = AppConfig.GROUP_URL + "/update_group"; //群组编辑 POST

  public static GROUP_DELETE_GROUP_URL: string = AppConfig.GROUP_URL + "/delete_group"; //删除群组 POST

  public static GROUP_UPD_MEMBER_STATUS_URL: string = AppConfig.GROUP_URL + "/update_member_status"; //修改群成员状态 POST

  public static GROUP_ALL_SHOW_URL: string = AppConfig.GROUP_URL + "/find_all_players";   //全部参与人展示

  //日程类
  public static SCHEDULE_ADD_URL: string = AppConfig.SCHEDULE_URL + "/create";    //添加（发布）日程 POST

  public static SCHEDULE_FIND_URL: string = AppConfig.SCHEDULE_URL + "/find";    //查询日程 POST

  public static SCHEDULE_UPDATE_STATE_URL: string = AppConfig.SCHEDULE_URL + "/states";  //更新日程状态

  public static SCHEDULE_DELETE_URL: string = AppConfig.SCHEDULE_URL + "/delete";  //删除日程

  public static SCHEDULE_TODAY_REMIND_URL: string = AppConfig.SCHEDULE_URL + "/find_today_remind";  //查询今天所有提醒时间

  public static SCHEDULE_CHOOSE_URL: string = AppConfig.SCHEDULE_URL + "/choose";  //接受或者拒绝邀请

  public static SCHEDULE_CALENDAR_MARK_URL: string = AppConfig.SCHEDULE_URL + "/find_flag";   //日历小标记

  //webSocket
  public static WEB_SOCKET_TASK_URL: string = AppConfig.WEB_SOCKET_URL + "/task";    //mq消息接收


  //讯飞语音
  public static XUNFEI_URL_TEXT: string = AppConfig.XIAOJIVOICE_URL + "/answer_text";    //文本回传 POST
  public static XUNFEI_URL_AUDIO: string = AppConfig.XIAOJIVOICE_URL + "/answer_audio";    //语音文件带答案回传 POST

}
