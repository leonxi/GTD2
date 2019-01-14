import {Injectable} from "@angular/core";
import {DwEmitService} from "./dw-emit.service";
import {AiuiModel} from "../../model/aiui.model";

/**
 * 语音技能对应统一逻辑处理
 *
 * create by wzy on 2018/12/20
 */
@Injectable()
export class EmitSpeechService {

  constructor(private dwEmit: DwEmitService) {}

  //统一广播推送
  public send(aiui: AiuiModel, sk: string) {
    let type = sk.substr(0,1);
    if (type == "A" || type == "B") {
      //语音业务只返回语音界面
      this.dwEmit.setHbData(aiui);
    } else if (type == "D") {
      //再根据具体业务返回对应页面
    }
  }

}