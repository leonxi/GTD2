package com.manager.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Pattern;

/**
 * create by wzy on 2018/04/26.
 */
public class BaseUtil {

    /*
     * 判断是否为整数
     * @param str 传入的字符串
     * @return 是整数返回true,否则返回false
     */

    public static boolean isInteger(String str) {
        Pattern pattern = Pattern.compile("[0-9]*");
        return pattern.matcher(str).matches();
    }

    /**
     * 字符串加密
     * @param str
     * @return
     */
    public static String encryption(String str){
//        String strKey="";
        try {
            String deadlineStr ="25201231";//截至时间
            //设置时间格式
            DateFormat dFormat = new SimpleDateFormat("yyyyMMdd");
            Date deadline = dFormat.parse(deadlineStr);
            str =Encoder.e(str,str,deadline);//这里str加密的字符串
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return str;
    }


}
