package com.xiaoji.gtd.dto;

/**
 * 登陆验证返回类
 *
 * create by wzy on 2018/11/20
 */
public class LoginOutDto extends BaseOut {

    private String accountQueue;
    private String userId;

    public String getAccountQueue() {
        return accountQueue;
    }

    public void setAccountQueue(String accountQueue) {
        this.accountQueue = accountQueue;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

}