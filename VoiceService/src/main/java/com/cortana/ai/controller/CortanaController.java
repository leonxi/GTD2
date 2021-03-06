package com.cortana.ai.controller;

import com.cortana.ai.bean.AiUiInBean;
import com.cortana.ai.bean.VoiceInBean;
import com.cortana.ai.service.AiUiService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 语音助手
 *
 * create by wzy on 2018/07/20
 */
@CrossOrigin
@RestController
@RequestMapping("/cortana")
public class CortanaController {

    private final AiUiService aiUiService;

    @Autowired
    public CortanaController(AiUiService aiUiService) {
        this.aiUiService = aiUiService;
    }

    /**
     * 语音解析，带答案回传
     * @param voiceInBean
     * @return
     */
    @RequestMapping(value = "/answer_audio", method = RequestMethod.POST)
    public Map answerAudio(@RequestBody VoiceInBean voiceInBean) {
        Map<String, String> data = new HashMap<>();

        String speechText = "";
        if (!voiceInBean.getContent().equals("") && voiceInBean.getContent() != null) {

            JSONObject joResult = new JSONObject(aiUiService.answerAudio(voiceInBean.getContent()));;
            speechText = joResult.toString();
            data.put("speechText", speechText);
            data.put("code", "0");
            data.put("message", "分析成功");
        } else {
            data.put("code", "-1");
            data.put("message", "缺少入参");
        }


        return data;
    }

    /**
     * 文本解析，答案回传
     * @param voiceInBean
     * @return
     */
    @RequestMapping(value = "/answer_text", method = RequestMethod.POST)
    public Map answerText(@RequestBody VoiceInBean voiceInBean) {
        Map<String, String> data = new HashMap<>();

        String speechText = "";
        if (!voiceInBean.getContent().equals("") && voiceInBean.getContent() != null) {

            JSONObject joResult = new JSONObject(aiUiService.answerText(voiceInBean.getContent()));;
            speechText = joResult.toString();
            data.put("speechText", speechText);
            data.put("code", "0");
            data.put("message", "分析成功");
        } else {
            data.put("code", "-1");
            data.put("message", "缺少入参");
        }


        return data;
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public String update(@RequestBody AiUiInBean inBean) {

        String date = aiUiService.update(inBean);

        return date;
    }
}
