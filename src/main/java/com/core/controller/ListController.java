package com.core.controller;

import com.core.service.ListService;
import com.core.util.Constant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by yk on 2017/5/25.
 */
@Controller
@RequestMapping("/")
public class ListController extends BaseController {

    @Autowired
    private ListService listService;

    @RequestMapping(value = "/c-{cId}-{page}.html", method = RequestMethod.GET)
    public String articleList(@ModelAttribute("cId") int cId, @ModelAttribute("page") int page) {
        Object[] result = listService.articleList(cId, page);
        request.setAttribute("list", result[1]);
        request.setAttribute("listUrl", "\"" + config.getListDomain() + String.format(config.getListParam() + "\"", cId));
        request.setAttribute("winTitle", result[2]);


        request.setAttribute(Constant.STATIC_RESOURCE_URL_PREFIX, config.getStaticResourceURLPrefix());
        request.setAttribute(Constant.LIST_PAGE_URL_PREFIX, config.getSearchDomain());

        return getView((String) result[0]);
    }

    @RequestMapping(value = "/s-{sId}-{page}.html", method = RequestMethod.GET)
    public String articleSerialList(@ModelAttribute("sId") int sId, @ModelAttribute("page") int page) {

        Object[] result = listService.articleSerialList(sId, page);
        request.setAttribute("list", result[1]);
        request.setAttribute("listUrl", "\"" + config.getListDomain() + String.format(config.getListParam() + "\"", sId));
        request.setAttribute("winTitle", result[2]);

        request.setAttribute(Constant.STATIC_RESOURCE_URL_PREFIX, config.getStaticResourceURLPrefix());
        request.setAttribute(Constant.LIST_PAGE_URL_PREFIX, config.getListDomain());

        return getView((String) result[0]);
    }

}
