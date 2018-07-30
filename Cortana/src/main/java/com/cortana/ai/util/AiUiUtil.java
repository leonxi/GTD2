package com.cortana.ai.util;

import com.cortana.ai.config.AiUiConfig;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import sun.misc.BASE64Encoder;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

/**
 * HTTP请求工具类
 *
 * create by wzy on 2018/07/23
 */
public class AiUiUtil {

    private static final String URL = "http://openapi.xfyun.cn/v2/aiui";
    private static final String APPID = "5b554446";
    private static final String API_KEY = "880d370a20234c95a33e961c70de3ed5";
    private static final String DATA_TYPE = "text";
    private static final String SCENE = "main";
    private static final String SAMPLE_RATE = "16000";
    private static final String AUTH_ID = "8b9133b8519875127034d7c3cb70a383";
    private static final String AUE = "raw";
    private static final String FILE_PATH = "";

    // 个性化参数，需转义
    private static final String PERS_PARAM = "{\\\"auth_id\\\":\\\"2894c985bf8b1111c6728db79d3479ae\\\"}";

    public static String readAudio(String audio){
        try {
            Map<String, String> header = buildHeader();
//        byte[] dataByteArray = readFile(FILE_PATH);
            String result = httpPost(URL, header, audio.getBytes());
            System.out.println(result);
            return result;
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return null;
    }

    private static Map<String, String> buildHeader() throws UnsupportedEncodingException, ParseException {
        String curTime = System.currentTimeMillis() / 1000L + "";
        String param = "{\"aue\":\""+AUE+"\",\"sample_rate\":\""+SAMPLE_RATE+"\",\"auth_id\":\""+AUTH_ID+"\",\"data_type\":\""+DATA_TYPE+"\",\"scene\":\""+SCENE+"\"}";
        //使用个性化参数时参数格式如下：
        //String param = "{\"aue\":\""+AUE+"\",\"sample_rate\":\""+SAMPLE_RATE+"\",\"auth_id\":\""+AUTH_ID+"\",\"data_type\":\""+DATA_TYPE+"\",\"scene\":\""+SCENE+"\",\"pers_param\":\""+PERS_PARAM+"\"}";
        String paramBase64 = new String(Base64.encodeBase64(param.getBytes("UTF-8")));
        String checkSum = DigestUtils.md5Hex(API_KEY + curTime + paramBase64);

        Map<String, String> header = new HashMap<String, String>();
        header.put("X-Param", paramBase64);
        header.put("X-CurTime", curTime);
        header.put("X-CheckSum", checkSum);
        header.put("X-Appid", APPID);
        return header;
    }

    private static byte[] readFile(String filePath) throws IOException {
        InputStream in = new FileInputStream(filePath);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024 * 4];
        int n = 0;
        while ((n = in.read(buffer)) != -1) {
            out.write(buffer, 0, n);
        }
        byte[] data = out.toByteArray();
        in.close();
        return data;
    }

    private static String httpPost(String url, Map<String, String> header, byte[] body) {
        String result = "";
        BufferedReader in = null;
        OutputStream out = null;
        try {
            URL realUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection)realUrl.openConnection();
            for (String key : header.keySet()) {
                connection.setRequestProperty(key, header.get(key));
            }
            connection.setDoOutput(true);
            connection.setDoInput(true);

            connection.setConnectTimeout(20000);
            connection.setReadTimeout(20000);
            try {
                out = connection.getOutputStream();
                out.write(body);
                out.flush();
            } catch (Exception e) {
                e.printStackTrace();
            }

            try {
                in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String line;
                while ((line = in.readLine()) != null) {
                    result += line;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
