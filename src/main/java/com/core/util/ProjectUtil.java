package com.core.util;

import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * 项目工具包
 * Created by sun on 2017/5/5.
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
}
