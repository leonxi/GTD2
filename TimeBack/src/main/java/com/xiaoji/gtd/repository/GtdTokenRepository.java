package com.xiaoji.gtd.repository;

import com.xiaoji.gtd.entity.GtdTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Token表DAO层 继承类
 *
 * create by wzy on 2018/11/20
 */
@Transactional
public interface GtdTokenRepository extends JpaRepository<GtdTokenEntity,Integer> {
}