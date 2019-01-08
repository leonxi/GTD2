package com.xiaoji.gtd.dto.sync;

/**
 * 表名称对应
 *
 * create by wzy on 2019/01/04
 */
public enum SyncTableNameEnum {

    USER("gtd_user"),
    PLAYER("gtd_player"), PLAYER_MEMBER("gtd_player_member"),
    SCHEDULE("gtd_schedule"), EXECUTE("gtd_execute"), LOCAL_SCHEDULE("gtd_local_schedule"),
    SCHEDULE_A("gtd_schedule_a"),SCHEDULE_B("gtd_schedule_b"),SCHEDULE_C("gtd_schedule_c"),SCHEDULE_D("gtd_schedule_d"),SCHEDULE_E("gtd_schedule_e"),
    PLAN("gtd_plan");

    public String tableName;

    SyncTableNameEnum(String tableName) {
        this.tableName = tableName;
    }

}