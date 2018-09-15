package com.manager.master.service.serviceImpl;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.*;
import com.manager.master.service.IAiUiService;
import com.manager.master.service.IGroupService;
import com.manager.master.service.IScheduleService;
import com.manager.util.AiUiUtil;
import com.manager.util.JsonParserUtil;
import com.manager.util.ResultCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 语义解析方法接口实现类
 *
 * create by wzy on 2018/09/14
 */
@Service
@Transactional
public class AiUiServiceImpl implements IAiUiService {

    private final IScheduleService scheduleService;
    private final IGroupService groupService;

    @Autowired
    public AiUiServiceImpl(IScheduleService scheduleService, IGroupService groupService) {
        this.scheduleService = scheduleService;
        this.groupService = groupService;
    }

    /**
     * 文本方法
     * @param inDto
     * @return
     */
    @Override
    public AiUiDataDto answerText(AiUiInDto inDto) {

        String outData = AiUiUtil.readAudio(inDto.getContent(), 1);

        return null;
    }

    /**
     * 音频方法
     * @param inDto
     * @return
     */
    @Override
    public AiUiDataDto answerAudio(AiUiInDto inDto) {

        AiUiDataDto aiuiData = null;
        //入参检测
        //非空检测
        if (inDto.getContent() == null || "".equals(inDto.getContent()))throw new ServiceException("缺少语音输入");
        if (inDto.getUserId() == null || "".equals(inDto.getUserId()))throw new ServiceException("缺少用户ID");

        //调用讯飞API
        String outData = AiUiUtil.readAudio(inDto.getContent(), 0);

        if ("".equals(outData) || outData == null) {
            throw new ServiceException("语音交互失败");
        }

        //解析讯飞回传数据
        aiuiData = JsonParserUtil.parse(outData);

        if (aiuiData == null || "".equals(aiuiData)) {
//            throw new ServiceException("语音数据解析失败");
            return  null;
        }

        //时间格式规整
        String scheduleStartTime = aiuiData.getScheduleStartTime();
        String scheduleDeadline = aiuiData.getScheduleDeadline();
        if (scheduleStartTime != null && scheduleStartTime.length() < 11 && !"".equals(scheduleStartTime)) {
            scheduleStartTime += " 00:00";
        } else if (scheduleStartTime != null && scheduleStartTime.length() > 11){
            scheduleStartTime = scheduleStartTime.replace("T", " ");
        }
        if (scheduleDeadline != null && scheduleDeadline.length() < 11 && !"".equals(scheduleDeadline)) {
            scheduleDeadline += " 00:00";
        } else if (scheduleDeadline != null && scheduleDeadline.length() > 11){
            scheduleDeadline = scheduleDeadline.replace("T", " ");
        }

        //根据动作做出对应业务逻辑
        // 1:发布日程 2:查找日程
        if (aiuiData.getCode() == 1) {
            ScheduleInDto scheduleData = new ScheduleInDto();
            GroupInDto groupFind = new GroupInDto();

            //标签 默认 一般标签
            List<Integer> labelIds = new ArrayList<>();
            labelIds.add(4);

            //参与人ID list
            List<Integer> groupIds = new ArrayList<>();
            for (String str: aiuiData.getUserNameList()) {
                groupFind.setGroupName(str);
                List<GroupOutDto> groupList = groupService.select(groupFind);
                if (groupList != null && groupList.size() != 0) {
                    for (GroupOutDto god: groupList) {
                        groupIds.add(god.getGroupId());
                    }
                } else {

                }
            }

            scheduleData.setGroupIds(groupIds);
            scheduleData.setUserId(inDto.getUserId());
            scheduleData.setScheduleName(aiuiData.getScheduleName());
            scheduleData.setScheduleStartTime(scheduleStartTime);
            scheduleData.setScheduleDeadline(scheduleDeadline);
            scheduleData.setLabelIds(labelIds);

            Integer flag = scheduleService.addSchedule(scheduleData);
            if (flag != 0){
                throw new ServiceException("创建失败");
            }

        } else if (aiuiData.getCode() == 2) {
            FindScheduleInDto findSchedule = new FindScheduleInDto();
            findSchedule.setScheduleStartTime(scheduleStartTime);
            findSchedule.setScheduleDeadline(scheduleDeadline);
            findSchedule.setUserId(inDto.getUserId());

            // 查询自己创建的日程
            List<FindScheduleOutDto> scheduleCreateList = scheduleService.findCreateSchedule(findSchedule);
            // 查询自己参与的日程
            List<FindScheduleOutDto> scheduleJoinList = scheduleService.findJoinSchedule(findSchedule);

            aiuiData.setScheduleCreateList(scheduleCreateList);
            aiuiData.setScheduleJoinList(scheduleJoinList);

        }

        return aiuiData;
    }

}
