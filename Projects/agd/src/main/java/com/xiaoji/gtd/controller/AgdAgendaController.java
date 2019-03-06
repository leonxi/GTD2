package com.xiaoji.gtd.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.dto.BaseOutDto;
import com.xiaoji.gtd.entity.AgdAgenda;
import com.xiaoji.gtd.services.IAgendaService;
import com.xiaoji.gtd.services.IContactsService;
import com.xiaoji.gtd.util.ReturnMessage;

/**
 * AgdAgendaController 日程管理控制层
 *
 */
@RestController
@CrossOrigin
@RequestMapping(value = "/")
public class AgdAgendaController {

    @Autowired
    IAgendaService agendaService;
    @Autowired
    IContactsService contanctService;
    /**
     * 保存日程
     * @param map ,method = RequestMethod.GET
     * @return
     */
    @RequestMapping(value="/agenda/save")
    @ResponseBody
    public BaseOutDto add(AgdAgendaDto blacklist,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	if(!"".equals(relId) && relId != null){
    		blacklist.setFc(relId);
    		AgdAgenda xj = agendaService.save(blacklist);
    		out.setData(xj);
    		out.setCode(ReturnMessage.SUCCESS_CODE);
    		out.setMessage(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setCode(ReturnMessage.ERROR_CODE);
    		out.setMessage(ReturnMessage.ERROR_MSG);
    	}

        return out;
    }
    
    /**
     * 获取日程信息
     * @param map
     * @return
     */
    @RequestMapping(value="/agenda/info")
    @ResponseBody
    public BaseOutDto getInfo(AgdAgendaDto blacklist,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	if(!"".equals(relId) && relId != null){
    		blacklist.setFc(relId);
    		contanctService.save(blacklist);
    		out.setCode(ReturnMessage.SUCCESS_CODE);
    		out.setMessage(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setCode(ReturnMessage.ERROR_CODE);
    		out.setMessage(ReturnMessage.ERROR_MSG);
    	}
        return out;
    }
    
    /**
     * 删除日程
     * @param map
     * @return
     */
    @RequestMapping(value="agenda/remove")
    @ResponseBody
    public BaseOutDto remove(AgdAgendaDto blacklist,HttpServletRequest request) {
    	
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	if(!"".equals(relId) && relId != null){
    		blacklist.setFc(relId);
    		agendaService.deleteById(blacklist);
    		out.setCode(ReturnMessage.SUCCESS_CODE);
    		out.setMessage(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setCode(ReturnMessage.ERROR_CODE);
    		out.setMessage(ReturnMessage.ERROR_MSG);
    	}
        return out;
    }
    
    /**
     * 保存参与人
     * @param map
     * @return
     */
    @RequestMapping(value="/agendacontacts/save")
    @ResponseBody
    public BaseOutDto saveContacts(AgdAgendaDto blacklist,HttpServletRequest request) {
    	
    	BaseOutDto out = new BaseOutDto();
    	String relId = request.getHeader("ai");
    	if(!"".equals(relId) && relId != null){
    		blacklist.setFc(relId);
    		contanctService.save(blacklist);
    		out.setCode(ReturnMessage.SUCCESS_CODE);
    		out.setMessage(ReturnMessage.SUCCESS_MSG);
    	}else{
    		out.setCode(ReturnMessage.ERROR_CODE);
    		out.setMessage(ReturnMessage.ERROR_MSG);
    	}
        return out;
    }

   
}
