package com.manager.master.repository;

import com.manager.master.dto.GroupInDto;
import com.manager.master.dto.GroupScheduleInDto;
import com.manager.master.entity.GtdGroupEntity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;

/**
 * 群组实现类
 */
@Transactional
@Repository
public class GroupRepository {
    @PersistenceContext
    private EntityManager em;






    /**
     * 根据标签名查出群组ID
     * @param labelName
     * @return
     */
    public List<Integer> findByLabelLike(String labelName){
        String sql="SELECT GROUP_ID FROM gtd_group_label where LABEL_ID=(select LABEL_ID from gtd_label where LABEL_NAME LIKE '%"+labelName+"%')";
        return (List<Integer>) em.createNativeQuery(sql).getResultList();
    }


   public List<Integer> findScheduleId(int groupId){
        String sql="SELECT SCHEDULE_ID FROM GTD_GROUP_SCHEDULE WHERE GROUP_ID="+groupId;
       return (List<Integer>) em.createNativeQuery(sql).getResultList();
   }

    /**
     * 根据 日程事件表ID 查询不包含在新群组ID列表里的 自增主键
     * @param list
     * @param scheduleId
     * @return
     */
    public List<Integer> findGroupScheduleIdByScheduleId(List<Integer> list,Integer scheduleId){
        String sql = "SELECT GROUP_SCHEDULE_ID FROM gtd_group_schedule WHERE SCHEDULE_ID = "+scheduleId+" and GROUP_ID not in("+list+")";
        return (List<Integer>) em.createNativeQuery(sql).getResultList();
    }

    /**
     * 根据 日程事件表ID 查询群组ID
     * @param scheduleId
     * @return
     */
    public List<Integer> findGroupIdByScheduleId(Integer scheduleId){
        String sql = "SELECT GROUP_ID FROM gtd_group_schedule WHERE SCHEDULE_ID = " + scheduleId;
        return (List<Integer>) em.createNativeQuery(sql).getResultList();
    }

    /**
     * 根据联系方式查询UserId
     * @param contact
     * @return
     */
    public int  findUserId(String contact){
        try {
            String sql="SELECT USER_ID FROM gtd_account WHERE ACCOUNT_MOBILE="+contact;
            return (int) em.createNativeQuery(sql).getSingleResult();
        }catch (Exception e){
            return 0;
        }

    }

    /**
     * 查询群成员状态
     * @param userContact
     * @param groupId
     * @return
     */
    public int findMemberStatus(String userContact,int groupId){
        String sql="SELECT GROUP_MEMBER_STATUS FROM GTD_GROUP_MEMBER WHERE USER_CONTACT="+userContact+" AND GROUP_ID="+groupId;
        return (int)em.createNativeQuery(sql).getSingleResult();
    }

    /**
     * 根据群组Id删除 本地
     * @param groupId
     */
    public void deleteByGroupId(int groupId){
        String sql="delete from gtd_group_label where group_id="+groupId;
        String sql2="delete from gtd_group_member where group_id="+groupId;
        String sql3="delete from gtd_group_schedule where group_id="+groupId;
        String sql4="delete from gtd_group where group_id="+groupId;
        em.createNativeQuery(sql).executeUpdate();
        em.createNativeQuery(sql2).executeUpdate();
        em.createNativeQuery(sql3).executeUpdate();
        em.createNativeQuery(sql4).executeUpdate();
    }

    public List<Object[]> findGroupByScheduleId(Integer scheduleId){
        String sql = "SELECT " +
                "group_tabel.GROUP_ID groupId," +
                "group_tabel.GROUP_NAME groupName " +
                "FROM gtd_group group_tabel " +
                "LEFT JOIN gtd_group_schedule group_sch " +
                "ON group_tabel.GROUP_ID = group_sch.GROUP_ID " +
                "WHERE group_sch.SCHEDULE_ID = " + scheduleId;
        return em.createNativeQuery(sql).getResultList();
    }


    public List<GtdGroupEntity> getGroups(String groupName){
        String sql="SELECT\n" +
                "gtd_group.GROUP_ID AS groupId,\n" +
                "gtd_group.GROUP_NAME AS groupName,\n" +
                "gtd_group.GROUP_HEADIMG_URL AS groupHeadImgUrl,\n" +
                "gtd_label.LABEL_ID AS lebelId,\n" +
                "gtd_label.LABEL_NAME AS labelName,\n" +
                "gtd_label.LABEL_TYPE AS labelType,\n" +
                "gtd_group_member.USER_ID AS memberId,\n" +
                "gtd_group_member.USER_NAME AS memberName,\n" +
                "gtd_group_member.USER_CONTACT AS memberContact\n" +
                "FROM\n" +
                "gtd_group\n" +
                "LEFT JOIN gtd_group_label ON gtd_group_label.GROUP_ID = gtd_group.GROUP_ID\n" +
                "LEFT JOIN gtd_group_member ON gtd_group_member.GROUP_ID = gtd_group.GROUP_ID\n" +
                "LEFT JOIN gtd_label ON gtd_group_label.LABEL_ID = gtd_label.LABEL_ID\n" +
                "WHERE\n" +
                "gtd_group.GROUP_NAME LIKE '"+groupName+"'GROUP BY gtd_group.GROUP_ID";
        return em.createNativeQuery(sql).getResultList();
    }

}
