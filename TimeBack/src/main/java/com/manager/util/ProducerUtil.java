package com.manager.util;

import com.manager.config.rabbitmq.RabbitProducerConfig;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.support.CorrelationData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * 生产者工具类
 *
 * create by wzy on 2018/07/19
 */
@Component
public class ProducerUtil implements RabbitTemplate.ConfirmCallback {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final RabbitTemplate rabbitTemplate;
    private final AmqpTemplate amqpTemplate;
    private final RabbitProducerConfig rabbitProducerConfig;

    @Autowired
    public ProducerUtil(AmqpTemplate amqpTemplate, RabbitTemplate rabbitTemplate, RabbitProducerConfig rabbitProducerConfig) {
        this.amqpTemplate = amqpTemplate;
        this.rabbitTemplate = rabbitTemplate;
        this.rabbitProducerConfig = rabbitProducerConfig;
    }

    /**
     * routing_key: taskQueue
     * @param sendMsg
     */
    public void send(String queueName, String sendMsg) {
        logger.info("点对点 消息 : "+ sendMsg);
        this.rabbitTemplate.convertAndSend("taskQueue", sendMsg);
    }

    /**
     * 通配符模式
     * 生产两种routing_key消息，最后会被exchange中设置的binding_key过滤，发送给对应消费者
     * @param exchangeName
     * @param userId
     * @param sendMsg
     */
    public void topicSend(String exchangeName, int userId, String sendMsg) {
        logger.info("topic 消息 : "+ sendMsg);
        String queueName = userId + ".#";
        this.amqpTemplate.convertAndSend(exchangeName, queueName, sendMsg);
    }

    /**
     * 订阅模式
     * @param sendMsg
     */
    public void fanoutSend(String exchangeName, String sendMsg) {
        logger.info("fanout 消息 : "+ sendMsg);
        this.amqpTemplate.convertAndSend(exchangeName, "abcd.ee", sendMsg);
    }

    /**
     * 回调类
     */
    public void callbackSend(String sendmsg) {

        rabbitTemplate.setConfirmCallback(this);
        String msg="callbackSender : i am callback sender" + sendmsg;
        System.out.println(msg );
        CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
        System.out.println("callbackSender UUID: " + correlationData.getId());
        this.rabbitTemplate.convertAndSend("exchange", "topic.messages", msg, correlationData);
    }

    /**
     * 回调方法 回调值
     * @param correlationData
     * @param b
     * @param s
     */
    @Override
    public void confirm(CorrelationData correlationData, boolean b, String s) {
        System.out.println("callback confirm: " + correlationData.getId());
    }

    /**
     * 测试点对点 routing_key: taskQueue
     * @param sendMsg
     */
    public void sendTheTarget(String sendMsg, String target) {
        logger.info("target" + target);
        logger.info("Sender1 : " + sendMsg);
        String[] mobile = target.split(",");
        for (String str: mobile) {
            this.rabbitTemplate.convertAndSend(str, sendMsg);
        }

    }

}
