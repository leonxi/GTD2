package com.manager.master.controller;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.*;
import com.manager.master.repository.RemindJpaRepository;
import com.manager.master.repository.RemindRepository;
import com.manager.master.repository.SchedulePlayersNewRepository;
import com.manager.master.service.IRemindService;
import com.manager.master.service.IScheduleService;
import com.manager.util.CommonMethods;
import com.manager.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 日程Controller
 *
 * create by wzy on 2018/08/24
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/schedule")
public class ScheduleController {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    IScheduleService scheduleService;

    @Autowired
    IRemindService remindService;

    @Resource
    private RemindRepository remindRepository;

    @RequestMapping(value = "/find",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto findSchedule(@RequestBody FindScheduleInDto indto){
        BaseOutDto baseOutDto = new BaseOutDto();
        Map<String,List> map = new HashMap<>();
        try{
            // 查询自己创建的日程
            List<FindScheduleOutDto> scheduleCreateList = scheduleService.findCreateSchedule(indto);
            // 查询自己参与的日程
            List<FindScheduleOutDto> scheduleJoinList = scheduleService.findJoinSchedule(indto);

            map.put("scheduleCreateList",scheduleCreateList);
            map.put("scheduleJoinList",scheduleJoinList);

            baseOutDto.setData(map);
            baseOutDto.setCode(ResultCode.SUCCESS);
            baseOutDto.setMessage("[查询完成]");
        } catch (Exception e){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("[查询失败]：请联系技术人员");
            logger.info(e.getMessage());
            throw new ServiceException("[查询失败]：请联系技术人员");
        }



        return baseOutDto;
    }

    /**
     * 新增日程
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto addSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        List<Integer> flag;
        try{
            flag = scheduleService.addSchedule(inDto);
            if (flag.get(0) == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("创建日程成功");
                // TODO 创建日程发布
//        String dataMessage = inDto.toString();
//        String target = inDto.getTarget();
//        producerUtil.sendTheTarget(dataMessage, target);
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("新增日程信息失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 编辑日程
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/editor", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag;
        try{
            flag = scheduleService.updateSchedule(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("编辑日程成功");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("更新日程信息失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 日程发布撤回参与人
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/withdraw", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto releaseToWithdrawSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag;
        try{
            flag = scheduleService.releaseToWithdrawSchedule(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("成功撤回");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("日程发布撤回失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 删除日程
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto deleteSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag;
        try{
            flag = scheduleService.deleteSchedule(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("成功删除日程");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("删除日程信息失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 日程状态修改
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/status", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto statusSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag;
        try{
            flag = scheduleService.statusSchedule(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("日程状态修改成功");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("日程状态修改失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 查询用户当天全部提醒时间
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/find_today_remind", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto findAllRemindTime(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        Map<String,List> data = new HashMap<>();
        try{
            List<RemindOutDto> remindList = scheduleService.findAllRemindTime(inDto);
            if (remindList != null && remindList.size() != 0){
                data.put("remindList", remindList);
                baseOutDto.setData(data);
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("提醒时间查询成功");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("数据库无数据");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 日程接受拒绝
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/choose",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto chooseAcceptOrRefuse(@RequestBody ScheduleInDto inDto){
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag;
        try{
            flag = scheduleService.chooseAcceptOrRefuse(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("日程状态修改成功");
            }else if(flag == 1){
                baseOutDto.setCode(ResultCode.REPEAT).setMessage("日程状态修改失败");
            }
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     *  提醒时间入库设置
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/remind_add",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto insertRemindTime(@RequestBody RemindInsertInDto inDto){
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag = 0;
        try{
            flag = remindService.insertRemind(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("提醒时间入库成功");
            }else if(flag == 1){
                baseOutDto.setCode(ResultCode.REPEAT).setMessage("提醒时间入库失败");
            }
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 提醒时间查询
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/remind_find",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto findRemind(@RequestBody RemindFindInDto inDto){
        logger.info("----- 开始调用接口：提醒时间查询 findRemind ------");
        BaseOutDto baseOutDto = new BaseOutDto();
        // 接收入参
        Integer userId = inDto.getUserId();         // 用户id
        Integer scheduleId = inDto.getScheduleId(); // 日程事件id
        // 必输项判断
        if(userId == null || "".equals(userId)){
            logger.error("useId为空");
            baseOutDto.setCode(ResultCode.REPEAT).setMessage("用户ID不可为空");
            return baseOutDto;
        }
        if(scheduleId == null || "".equals(scheduleId)){
            logger.error("scheduleId为空");
            baseOutDto.setCode(ResultCode.REPEAT).setMessage("日程事件ID不可为空");
            return baseOutDto;
        }
        // 业务处理
        logger.info("----- 业务处理 -----");
        // 查询 提醒时间
        List<Object[]> remindList = new ArrayList<>();
        List<RemindOutDto> remind = new ArrayList<>();
        try {
            remindList = remindRepository.findRemindByUserIDAndScheId(userId,scheduleId);
        } catch (Exception ex){
            throw new ServiceException("---- findRemindByUserIDAndScheId 语法错误----");
        }
        if(remindList.size()>0){
            for(Object[] re : remindList){
                RemindOutDto out = new RemindOutDto();
                out.setRemindId((Integer)re[0]);
                out.setRemindDate(re[1].toString());
                remind.add(out);
            }
        }

        Map<String,List> data = new HashMap<>();
        data.put("remindList", remind);
        baseOutDto.setData(data);
        baseOutDto.setCode(ResultCode.SUCCESS).setMessage("提醒时间查询成功");

        return baseOutDto;
    }

    /**
     * 提醒时间更新
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/remind_update",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateRemind(@RequestBody RemindUpdateInDto inDto){
        logger.info("----- 开始执行[提醒时间更新] updateRemind -----");
        BaseOutDto baseOutDto = new BaseOutDto();
        // 获取入参
        Integer userId = inDto.getUserId();     // 用户id
        String remindDate = inDto.getRemindDate();  // 提醒时间：yyyy-MM-dd HH:mm
        Integer remindType = inDto.getRemindType(); // 提醒类型
        Integer remindId = inDto.getRemindId();     // 提醒时间id

        // 入参必输项判断
        if(userId == null || "".equals(userId)){
            logger.error("----- 用户id 不能为空 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("userId 不能为空");
            return baseOutDto;
        }
        if(remindDate == null || "".equals(remindDate)){
            logger.error("----- 提醒时间 不能为空 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("remindDate 不能为空");
            return baseOutDto;
        }
        if(remindType == null || "".equals(remindType)){
            logger.error("----- 提醒类型 不能为空 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("remindType 不能为空");
            return baseOutDto;
        }
        if(remindId == null || "".equals(remindId)){
            logger.error("----- 提醒时间id 不能为空 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("remindId 不能为空");
            return baseOutDto;
        }
        // 入参类型判断
        if(!CommonMethods.checkIsDate(remindDate)){
            logger.error("----- 提醒时间 格式错误 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("remindDate 格式错误");
            return baseOutDto;
        }
        // 业务处理
        logger.info("----- 业务处理 -----");
        int flag = 0;
        try{
           flag =  remindService.updateRemindDate(userId,remindDate,remindType,remindId);
        } catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        if(flag == 0){
            baseOutDto.setCode(ResultCode.SUCCESS).setMessage("remindId: "+remindId+" - 提醒时间更新完成");
        } else {
            baseOutDto.setCode(ResultCode.FAIL).setMessage("remindId: "+remindId+" - 提醒时间更新失败");
        }
        return baseOutDto;

    }

    /**
     * 提醒时间删除
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/remind_delete",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateRemind(@RequestBody RemindDeleteInDto inDto){
        BaseOutDto baseOutDto = new BaseOutDto();
        Integer userId = inDto.getUserId(); // 用户id
        Integer remindId = inDto.getRemindId(); // 提醒时间id
        // 入参必须项检查
        if(userId == null || "".equals(userId)){
            logger.error("----- 用户id 不能为空 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("userId 不能为空");
            return baseOutDto;
        }
        if(remindId == null || "".equals(remindId)){
            logger.error("----- 提醒时间id 不能为空 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("remindId 不能为空");
            return baseOutDto;
        }
        // 业务处理
        logger.info("----- 业务处理 -----");
        int flag = 0;
        try{
            flag = remindService.deleteRemind(remindId);
        } catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        if(flag == 0){
            baseOutDto.setCode(ResultCode.SUCCESS).setMessage("remindId: "+remindId+" - 提醒时间已删除");
        } else {
            baseOutDto.setCode(ResultCode.FAIL).setMessage("remindId: "+remindId+" - 提醒时间删除失败");
        }
        return baseOutDto;
    }

    /**
     * 当月日程总览
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/find_flag",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto findScheduleFlag(@RequestBody ScheduleDetailsInDto inDto){
        logger.info("----- 开始 findScheduleDetailsByMounth -----");
        BaseOutDto baseOutDto = new BaseOutDto();
        // 接受入参
        Integer userId = inDto.getUserId(); // 用户id
        String year = inDto.getYear();      // 查询年份
        String mouth = inDto.getMonth();    // 查询月份
        int daySum = inDto.getDaySum();     // 当月天数
        // 入参必须项检查
        logger.info("--- 入参检查 ---");
        if(userId == null || "".equals(userId)){
            logger.error("----- 用户id 不能为空 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("userId 不能为空");
            return baseOutDto;
        }
        if(year == null || "".equals(year.trim())){
            logger.error("----- 查询年份 不能为空 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("year 不能为空");
            return baseOutDto;
        }
        if(mouth == null || "".equals(mouth.trim())){
            logger.error("----- 查询月份 不能为空 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("mouth 不能为空");
            return baseOutDto;
        }
        // 入参类型判断
        if(!CommonMethods.isInteger(year)){
            logger.error("----- 查询年份 输入有误 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("year 输入有误");
            return baseOutDto;
        }
        List<String> mouthList = new ArrayList<>();
        mouthList.add("1");
        mouthList.add("2");
        mouthList.add("3");
        mouthList.add("4");
        mouthList.add("5");
        mouthList.add("6");
        mouthList.add("7");
        mouthList.add("8");
        mouthList.add("9");
        mouthList.add("10");
        mouthList.add("11");
        mouthList.add("12");
        if(!CommonMethods.isInteger(mouth) || !mouthList.contains(mouth)){
            logger.error("----- 查询月份 输入有误 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("mouth 输入有误");
            return baseOutDto;
        }
        if(daySum < 28){
            logger.error("----- 当月天数 输入有误 -----");
            baseOutDto.setCode(ResultCode.FAIL).setMessage("daySum 输入有误");
            return baseOutDto;
        }

        List<ScheduleDetailsOutDto> result = scheduleService.findScheduleFlag(inDto);
        Map<String,List<ScheduleDetailsOutDto>> map = new HashMap<>();
        map.put("resultList",result);
        baseOutDto.setCode(ResultCode.SUCCESS);
        baseOutDto.setData(map);

        return baseOutDto;
    }
}
