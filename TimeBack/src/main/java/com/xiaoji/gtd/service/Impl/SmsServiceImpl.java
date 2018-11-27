package com.xiaoji.gtd.service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.xiaoji.config.exception.ServiceException;
import com.xiaoji.gtd.dto.code.TimerDto;
import com.xiaoji.gtd.service.ISmsService;
import com.xiaoji.util.TimerUtil;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Map;
import java.util.Random;
import java.util.TreeMap;

/**
 * 短信接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
@Transactional
public class SmsServiceImpl implements ISmsService {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Value("${submail.messageXsend.time}")
    private String TIME;
    @Value("${submail.messageXsend.url}")
    private String URL;
    @Value("${submail.messageXsend.appid}")
    private String APPID;
    @Value("${submail.messageXsend.appkey}")
    private String APPKEY;
    @Value("${submail.messageXsend.project.authcode}")
    private String PROJECT;
    @Value("${submail.messageXsend.signtype}")
    private String SIGNTYPE;

    /**
     * 获取验证码
     * @param mobile
     * @return
     */
    @Override
    public int getAuthCode(String mobile) {

        try {
            requestSubMail(mobile);
        } catch (Exception e) {
            e.printStackTrace();
            logger.debug("短信验证接口请求失败");
            return 1;
        }

        return 0;
    }

    /**
     * 请求赛邮短信推送API
     * @param to
     */
    private void requestSubMail(String to) {

        TreeMap<String, Object> requestData = new TreeMap<String, Object>();
        JSONObject vars = new JSONObject();

        String code = new Random().nextInt(10) + String.valueOf((new Random().nextInt(89999)) + 10000);;
        vars.put("code", code);
        vars.put("time", TIME);

        requestData.put("appid", APPID);
        requestData.put("project", PROJECT);
        requestData.put("to", to);

        if(!vars.isEmpty()){
            requestData.put("vars",vars.toString());
        }
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        @SuppressWarnings("deprecation")
        ContentType contentType = ContentType.create(HTTP.PLAIN_TEXT_TYPE,HTTP.UTF_8);
        for(Map.Entry<String, Object> entry: requestData.entrySet()){
            String key = entry.getKey();
            Object value = entry.getValue();
            if(value instanceof String){
                builder.addTextBody(key, String.valueOf(value),contentType);
            }
        }
        builder.addTextBody("signature", APPKEY, contentType);
        /*if(signtype.equals(TYPE_MD5) || signtype.equals(TYPE_SHA1)){
            String timestamp = getTimestamp();
            requestData.put("timestamp", timestamp);
            requestData.put("sign_type", signtype);
            String signStr = appid + appkey + RequestEncoder.formatRequest(requestData) + appid + appkey;

            builder.addTextBody("timestamp", timestamp);
            builder.addTextBody("sign_type", signtype);
            builder.addTextBody("signature", RequestEncoder.encode(signtype, signStr), contentType);
        }else{
            builder.addTextBody("signature", appkey, contentType);
        }*/


        HttpPost httpPost = new HttpPost(URL);
        httpPost.addHeader("charset", "UTF-8");
        httpPost.setEntity(builder.build());
        try{
            CloseableHttpClient closeableHttpClient = HttpClientBuilder.create().build();
            HttpResponse response = closeableHttpClient.execute(httpPost);
            HttpEntity httpEntity = response.getEntity();
            if(httpEntity != null){
                JSONObject jsonStr = JSONObject.parseObject(EntityUtils.toString(httpEntity, "UTF-8"));
                String status = jsonStr.getString("status");
                if ("success".equals(status)) {
                    TimerUtil.putCache(to, new TimerDto(to, code, System.currentTimeMillis() + 10 * 1000 * 60));
                } else {
                    throw new ServiceException();
                }
            }
        } catch(IOException e){
            throw new ServiceException();
        }

    }
}
