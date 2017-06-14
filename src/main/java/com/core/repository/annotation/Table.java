package com.core.repository.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Created by sun on 2017/5/26.
 */
@Target(value = {ElementType.TYPE})@Retention(value = RetentionPolicy.RUNTIME)
public abstract @interface Table {

    public abstract java.lang.String name() default "";
}

