package com.core.repository;

import com.core.security.annotation.AsRight;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by sun
 */
@Repository
public class SecurityRepository extends BaseRepository {

    protected Log logger = LogFactory.getLog(BaseRepository.class);

    public boolean hasRight(long userId, Method method){
        AsRight asRight = method.getAnnotation(AsRight.class);
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("userId", userId);
        param.put("rightId", asRight.id());

        String sql = "SELECT COUNT(1) " +
                "FROM " +
                    config.getDbName() + "_user AS u, " +
                    config.getDbName() + "_role AS r, " +
                    config.getDbName() + "_auth_role AS ar, " +
                    config.getDbName() + "_role_function AS rf " +
                "WHERE " +
                    "u.id = :userId " +
                    "AND rf.fId = :rightId " +
                    "AND u.status > 0 " +
                    "AND ar.uId = u.id " +
                    "AND rf.rId = r.id " +
                    "AND rf.rId = ar.rId";

        Integer count = jdbcTemplate.queryForObject(sql, param, Integer.class);

        return (count > 0);
    }
}
