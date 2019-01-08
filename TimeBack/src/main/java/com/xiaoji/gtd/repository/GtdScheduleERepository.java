package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdScheduleEEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 日程事件子表(备忘录)DAO层 继承类
 *
 * create by wzy on 2019/01/07
 */
@Transactional
public interface GtdScheduleERepository extends JpaRepository<GtdScheduleEEntity, Integer> {

    /**
     * 查询用户下全部日程事件子表数据
     * @return
     */
    @Query(value = "SELECT * FROM gtd_schedule_e TA INNER JOIN gtd_schedule TB ON TB.SCHEDULE_ID = TA.SCHEDULE_ID WHERE TB.USER_ID = ?1", nativeQuery = true)
    List<GtdScheduleEEntity> findAllByUserId(String userId);
}