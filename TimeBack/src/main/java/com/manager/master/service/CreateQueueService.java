package com.manager.master.service;

import com.manager.master.dto.GroupInDto;
import com.manager.master.dto.GroupOutDto;
import com.manager.master.entity.GtdGroupEntity;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.io.IOException;
import java.util.List;

/**
 * 创建队列Service
 *
 *
 */
public interface CreateQueueService {
    /**
     * 创建队列
     *
     * @param userId 用户id
     * @param exchangeName 交换机名
     */
      String createQueue(int userId, String exchangeName) throws IOException;

}