Ext.define('classic.expand.overrides.data.proxy.Ajax', {
    override: 'Ext.data.proxy.Ajax',

    config: {
        simpleFilterMode: true// 组合filters普通参数
    },

    getParams: function (operation) {
        if (!operation.isReadOperation) {
            return {};
        }

        var me = this,
            params = {},
            grouper = operation.getGrouper(),
            sorters = operation.getSorters(),
            filters = operation.getFilters(),
            page = operation.getPage(),
            start = operation.getStart(),
            limit = operation.getLimit(),
            simpleFilterMode = me.getSimpleFilterMode(),
            simpleSortMode = me.getSimpleSortMode(),
            simpleGroupMode = me.getSimpleGroupMode(),
            pageParam = me.getPageParam(),
            startParam = me.getStartParam(),
            limitParam = me.getLimitParam(),
            groupParam = me.getGroupParam(),
            groupDirectionParam = me.getGroupDirectionParam(),
            sortParam = me.getSortParam(),
            filterParam = me.getFilterParam(),
            directionParam = me.getDirectionParam(),
            hasGroups, index;

        if (pageParam && page) {
            params[pageParam] = page;
        }

        if (startParam && (start || start === 0)) {
            params[startParam] = start;
        }

        if (limitParam && limit) {
            params[limitParam] = limit;
        }

        hasGroups = groupParam && grouper;
        if (hasGroups) {
            // Grouper is a subclass of sorter, so we can just use the sorter method
            if (simpleGroupMode) {
                params[groupParam] = grouper.getProperty();
                params[groupDirectionParam] = grouper.getDirection();
            } else {
                params[groupParam] = me.encodeSorters([grouper], true);
            }
        }

        if (sortParam && sorters && sorters.length > 0) {
            if (simpleSortMode) {
                index = 0;
                // Group will be included in sorters, so grab the next one
                if (sorters.length > 1 && hasGroups) {
                    index = 1;
                }
                params[sortParam] = sorters[index].getProperty();
                params[directionParam] = sorters[index].getDirection();
            } else {
                params[sortParam] = me.encodeSorters(sorters);
            }

        }

        if (filterParam && filters && filters.length > 0) {
            if (simpleFilterMode) {
                delete params[filterParam];

                var filter, param;

                for (var i = 0; i < filters.length; i++) {
                    filter = filters[i];

                    param = filter.getProperty();

                    params[param] = filter.getValue();
                }
            } else {
                params[filterParam] = me.encodeFilters(filters);
            }

        }

        return params;
    }


});
;Ext.define("Ext.locale.zh_CN.ux.TabCloseMenu", {
    override: "Ext.ux.TabCloseMenu",
    closeAllTabsText: '关闭所有',
    closeOthersTabsText: '关闭其它',
    closeTabText: '关闭'
});
// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.zh_CN.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "读取中..."
});
;Ext.define('expand.ux.AdvancedVType', {
    override: 'Ext.form.field.VTypes',

    daterange: function (val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = field.up().down('#' + field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = field.up().down('#' + field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    },

    daterangeText: '开始日期必须在结束日期之前',

    password: function (val, field) {
        if (field.initialPassField) {
            var pwd = field.up('form').down('#' + field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    passwordText: '确认密码与新密码不匹配，请重新输入',

    phone: function (val, field) {
        try {
            if (/^(((13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])[0-9]{8})|(1349[0-9]{7}))$/.test(val))
                return true;
            return false;
        }
        catch (e) {
            return false;
        }
    },
    phoneText: '请输入正确的11位手机号码'

});
;Ext.define('Ext.ux.Msg', {
    extend: 'Ext.window.MessageBox',

    config: {
        title: '提示'
    },

    alert: function (msg, callback) {
        this.show({
            title: this.getTitle(),
            message: msg,
            buttons: this.OK,
            fn: callback
        });
    },
    info: function (msg, title, callback) {
        if (typeof  title === 'function') {
            callback = title;
            title = '';
        }
        this.show({
            title: title || this.getTitle(),
            message: msg,
            buttons: this.OK,
            icon: this.INFO,
            fn: callback
        });
    },
    warning: function (msg, title, callback) {
        if (typeof  title === 'function') {
            callback = title;
            title = '';
        }
        this.show({
            title: title || this.getTitle(),
            message: msg,
            buttons: this.OK,
            icon: this.WARNING,
            fn: callback
        });
    },
    question: function (msg, title, callback) {
        if (typeof  title === 'function') {
            callback = title;
            title = '';
        }
        this.show({
            title: title || this.getTitle(),
            message: msg,
            buttons: this.OK,
            icon: this.QUESTION,
            fn: callback
        });
    },
    error: function (msg, title, callback) {
        if (typeof  title === 'function') {
            callback = title;
            title = '';
        }
        this.show({
            title: title || this.getTitle(),
            message: msg,
            buttons: this.OK,
            icon: this.ERROR,
            fn: callback
        });
    },
    formFailure: function (form, action) {
        var msg = action.result ? action.result.msg : '提交失败';

        this.show({
            title: '错误提示',
            message: msg,
            buttons: this.OK,
            icon: this.ERROR
        });
    },
    ajaxFailure: function (response, opts) {
        var obj = Ext.decode(response.responseText);


        var msg = obj['msg'] ? obj['msg'] : '操作失败';

        this.show({
            title: '错误：' + response.status,
            message: msg,
            buttons: this.OK,
            icon: this.ERROR
        });

    }

}, function (Msg) {
    Ext.onInternalReady(function () {
        Ext.ux.Msg = new Msg();
    });
});