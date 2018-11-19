package com.xiaoji.master.repository;

import com.xiaoji.master.entity.GtdRuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

/**
 * 规则表实现类
 */
@Transactional
public interface RuleJpaRepository extends JpaRepository<GtdRuleEntity,Integer>{
}