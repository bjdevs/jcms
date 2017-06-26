package com.core.util;

import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.awt.datatransfer.Transferable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;


/**
 * 项目工具包
 * Created by sun
 */

public class ProjectUtil {

    /**
     * 生成日期时间 + 随机数 + 扩展名
     * @param fileName
     * @return
     */
    public static String getFileName(String fileName) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd_HHmmss");
        String[] fileNames = fileName.split("\\.");
        return simpleDateFormat.format(new Date())
                + String.valueOf((int)(1000 + Math.random() * 9999)) + "." + fileNames[fileNames.length-1];
    }

    /**
     * 根据密码字典随机生成密码
     * @param len 设置密码长度
     * @return
     */
    public static String getPassWordOne(int len){
        int i;  //生成的随机数
        int count = 0; //生成的密码的长度
        // 密码字典
        char[] str = {
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        };
        StringBuilder stringBuilder = new StringBuilder("");
        Random r = new Random();
        while(count < len){
            //生成 0 ~ 密码字典-1之间的随机数
            i = r.nextInt(str.length);
            stringBuilder.append(str[i]);
            count ++;
        }
        return stringBuilder.toString();
    }
}
