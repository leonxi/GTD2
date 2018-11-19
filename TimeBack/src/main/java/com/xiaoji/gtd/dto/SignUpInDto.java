package com.xiaoji.gtd.dto;

/**
 * create by wzy on 201/05/03
 * 用户登陆信息入参类
 */
public class SignUpInDto {

    private String accountMobile;       //手机号
    private String accountPassword;     //登陆密码
    private String deviceId;            //设备ID
    private String authCode;            //验证码
    private String userId;     // 用户ID


    public String getAccountMobile() {
        return accountMobile;
    }

    public void setAccountMobile(String accountMobile) {
        this.accountMobile = accountMobile;
    }

    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
