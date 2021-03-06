package com.manager.master.dto;

/**
 * 讯飞语音入参类
 *
 * create by wzy on 2018/09/14
 */
public class AiUiInDto {
    private String content;         //base64转码语音文件  /  文本
    private Integer userId;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
