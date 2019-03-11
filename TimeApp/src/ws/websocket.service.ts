import {SockJS} from 'sockjs-client';
import Stomp, {StompSubscription} from "@stomp/stompjs";
import {DispatchService} from "./dispatch.service";
import {WsModel} from "./model/ws.model";


/**
 * WebSocket连接Rabbitmq服务器
 *
 * create by wzy on 2018/07/22.
 */
export class WebsocketService {
  RABBITMQ_WS_URL: string = "wss://www.guobaa.com/ws";

  //登陆账户
  private login: string;
  private password: string;
  private client: Stomp.Client;
  private queue: string;
  private subscription: StompSubscription

  constructor(private dispatchService: DispatchService) {
  }


  private settingWs(): Promise<any> {

    return new Promise<any>((resolve, reject) => {

      this.login = "gtd_mq";
      this.password = "gtd_mq";
      //获取websocte 链接 TODO
      this.client = Stomp.client(this.RABBITMQ_WS_URL);

      //获取websocte  queue TODO
      this.queue = "";
      //呼吸
      this.client.heartbeat.outgoing = 0;
      this.client.heartbeat.incoming = 0;

      resolve();
    })
  }

  /**
   * 监听消息队列
   */
  public connect() {
    this.settingWs().then(resolve => {
      console.log("-----MQ开始建立连接----");
      console.log("-----MQ QUEUE_NAME: [" + this.queue + "] ----");

      // 连接消息服务器
      this.client.connect(this.login, this.password, frame => {
        console.log(this.client);
        this.subscription = this.client.subscribe("/queue/" + this.queue, data => {
          this.dispatchService.dispatch(data.body);
        });
      }, error => {
        console.log('错误回调webSocket error! :' + error);
        this.connect();

      }, event => {
        console.log('关闭回调socket close!' + event);
      }, '/');
    })
  }

  public close() {
    // 连接消息服务器
    this.subscription.unsubscribe({
      login: this.login,
      passcode: this.password
    });
    this.client.disconnect(() => {
    }, {
      login: this.login,
      passcode: this.password
    });
  }

}