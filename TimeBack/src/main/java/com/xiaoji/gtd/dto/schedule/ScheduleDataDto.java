package com.xiaoji.gtd.dto.schedule;

import com.xiaoji.gtd.dto.player.PlayerDataDto;

import java.util.List;

/**
 *  日程数据类
 *
 *  create by wzy on 2019/01/17
 */
public class ScheduleDataDto {

    private String scheduleId;          //scheduleId;
    private String scheduleName;      //scheduleName;
    private String startTime;      //startTime;
    private String endTime;      //endTime;
    private String label;      //label;
    private List<PlayerDataDto> players;     //players 包含accountMobile和userId
    private String status;      //status;

    public String getScheduleName() {
        return scheduleName;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(String scheduleId) {
        this.scheduleId = scheduleId;
    }

    public List<PlayerDataDto> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerDataDto> players) {
        this.players = players;
    }

}