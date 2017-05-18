package com.core.service;

import com.core.domain.KeyWord;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * Created by yk on 2017/5/8.
 * 有关于文章通用Service
 */
@Service
public class GeneralArticleService extends BaseService {

    /**
     * 获得标签
     * @return
     */
    public ObjectNode getKeyWord(){
        ObjectNode objectNode = objectMapper.createObjectNode();

        List<KeyWord> keyWords = list(KeyWord.class, "ORDER BY count DESC", null);

         objectNode.put("rows", objectMapper.valueToTree(keyWords));

        return objectNode;
    }

    /**
     * 创建文章创建时 -- 创建新标签
     * @param name
     */
    public long createKeyWord(String name){
        KeyWord keyWord = new KeyWord();
        keyWord.setName(name);
        keyWord.setCount(1);
        keyWord.setDepict(null);
        keyWord.setCreateDate(new Date());
        return create(keyWord);
    }

    /**
     * 修改标签的使用次数
     * @param id
     */
    public void updateKeyWordToCount(long id){
        KeyWord keyWord = find(KeyWord.class, id);
        try{
            if(null != keyWord){
                keyWord.setCount(keyWord.getCount()+1);
                update(keyWord);
            }
        } catch (Exception e){

        }
    }

}
