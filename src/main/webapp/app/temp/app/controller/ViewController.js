Ext.define('Admin.controller.ViewController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Admin.view.common.window.MovePanel'
    ],

    config: {
        // url: '', // 子控制器赋值
        searchPrefix: 'search-',
        searchGridSuffix: '-mgrid'
    },

    getContentPanel: function () {
        return Admin.app.getController('AppController').getContentPanel();
    },

    /**
     * searchpanel - 查询
     */
    onSearchPanelQuery: function () {
        var ctrl = this,
            view = ctrl.getView(),

            searchPrefix = ctrl.getSearchPrefix(),
            searchGridSuffix = ctrl.getSearchGridSuffix(),
            searchComs = view.query('[itemId^=' + searchPrefix + ']');

        var grid = view.down(view.xtype + searchGridSuffix),
            store = grid.getStore();

        var filters = [];

        Ext.each(searchComs, function (item, index, allItems) {
            var key = item.itemId.slice(searchPrefix.length),
                value = item.getValue();

            if (value && typeof value === 'string') {
                value = value.indexOf('全部') > -1 ? '' : value;
            } else if (item.xtype == 'datefield') {
                value = Ext.Date.format(value, 'Y-m-d H:i:s');
            }

            filters.push({
                property: key,
                value: value
            });
        });

        // 实现远程过滤 , 目前在这里设置,是为了节省store的一行代码,可能有未知异常,需要注意
        //if (!store.getRemoteFilter()) store.setRemoteFilter(true);
        //store.setFilters(filters);
        store.filter(filters);
    },

    /**
     * searchpanel - 重置
     */
    onSearchPanelReset: function () {
        var ctrl = this,
            view = ctrl.getView(),

            searchPrefix = ctrl.getSearchPrefix(),
            searchGridSuffix = ctrl.getSearchGridSuffix(),
            searchComs = view.query('[itemId^=' + searchPrefix + ']');

        var grid = view.down(view.xtype + searchGridSuffix),
            store = grid.getStore();

        Ext.each(searchComs, function (item, index, allItems) {
            item.setValue('');
        });
        store.clearFilter();
    },

    /**
     * form submit
     * @param form
     * @param formCfg
     * @param callback
     */
    formSubmit: function (form, formCfg, callback) {
        var cfg = Ext.apply({
            submitEmptyText: false, // 不发送空值,默认会发送
            url: '',
            waitMsgTarget: true,
            waitMsg: '请稍候...',
            success: callback, // 回调交给各自调用者处理
            failure: Ext.ux.formFailure
        }, formCfg);

        form.submit(cfg);
    },
    /**
     * 用于只发送id ids的操作
     * @param action
     * @param text
     * @param grid
     * @param ajaxCfg
     */
    sendAjaxFromIds: function (action, text, grid, ajaxCfg) {
        if (!action) {
            Ext.log('缺少action');
            return;
        }

        var ids = [];

        Ext.each(grid.getSelection(), function (item, index, allItems) {

            if (item.id !== 0) {
                ids.push(item.id);
            }
        });

        if (ids.length == 0) return;

        var cfg = Ext.apply({
            url: '',
            params: {
                method: action,
                ids: ids
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);

                var success = obj['success'],
                    msg = obj['msg'],
                    message = obj['message'];

                if (success) {
                    if (obj['result'] == 'noRight') {
                        Ext.Msg.alert("警告", "您没有权限操作 :(").setIcon(Ext.Msg.WARNING);
                    } else if (obj['result'] == 'failed') {
                        Ext.Msg.alert("更新失败", message).setIcon(Ext.Msg.WARNING);
                    } else {
                        Ext.ux.Msg.info(text + '成功' + (obj['result'] == 'custom' ? "，" + message : ""), function () {
                            // 不需要重置pageNo
                            grid.getStore().reload();
                            grid.getSelectionModel().deselectAll();
                        });
                    }
                } else {
                    Ext.ux.Msg.ajaxFailure(response, opts);
                }
            },
            failure: Ext.ux.Msg.ajaxFailure
        }, ajaxCfg);

        if (action == "move") {
            var me = this,
                view = me.getView();
            var win = me.lookupReference("moveWindow");

            if (!win) {
                win = Ext.create({
                    xtype: 'moveCategoty-tree',
                    reference: "moveWindow",
                    ids: ids
                });

                view.add(win);
            }
            win.show();

        } else {
            Ext.MessageBox.confirm('提示', '共选中【' + ids.length + '】项，确定要【' + text + '】吗？', function (result) {
                if (result === 'no') return;
                Ext.Ajax.request(cfg);
            });
        }
    },

    /**
     * 用于单元格修改数据
     * @param action
     * @param text
     * @param grid
     * @param ajaxCfg
     */
    sendAjaxFromData: function (action, text, grid, ajaxCfg) {
        if (!action) {
            Ext.log('缺少action');
            return;
        }

        var data = [];

        Ext.each(grid.getSelection(), function (item, index, allItems) {
            if (item.dirty) {
                data.push(item.data);
            }
        });

        if (data.length == 0) return;

        var cfg = Ext.apply({
            url: '',
            params: {
                method: action,
                data: Ext.util.JSON.encode(data)
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);

                var success = obj['success'],
                    msg = obj['msg'];

                if (success) {
                    if (obj['result'] == 'noRight') {
                        Ext.Msg.alert("警告", "您没有权限操作 :(").setIcon(Ext.Msg.WARNING);
                    } else {
                        Ext.ux.Msg.info(text + '成功', function () {
                            // 不需要重置pageNo
                            grid.getStore().reload();
                            grid.getSelectionModel().deselectAll();
                        });
                    }
                } else {
                    Ext.ux.Msg.ajaxFailure(response, opts);
                }
            },
            failure: Ext.ux.Msg.ajaxFailure
        }, ajaxCfg);

        Ext.MessageBox.confirm('提示', '共选中【' + data.length + '】项，确定要【' + text + '】吗？', function (result) {
            if (result === 'no') return;
            Ext.Ajax.request(cfg);
        });

    },

    /**
     * 按钮点击 - 刷新 grid store
     * @param button
     */
    onRefreshBtnClicked: function (button) {

        // 重置分页
        var grid = button.up('grid'),
            store = button.up('grid').getStore();

        store.getProxy().setExtraParam('page', 1);
        store.reload();

        grid.getSelectionModel().deselectAll();
    },

    /**
     * common - 表单重置
     * @param button
     */
    onResetBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        view.down('form').reset();
    },


    /* temp function */
    onBtnClicked: function (button) {
        Ext.log(button.text);
    },

    /**
     * 全局发布
     * @param button
     */
    onClickBtnPublish: function (button) {
        var grid = button.up().up().up().down('grid');
        Ext.Ajax.request({
            url: '/cn/article/create/index',
            method: 'POST',
            /*params: {
                userId: _am.currentUser.id
            },*/
            waitMsg: '正在发布，请稍候...',
            success: function (response) {
                var data = JSON.parse(response.responseText);
                if (data.success) {
                    Ext.ux.Msg.info('发布成功', function () {
                        grid.getStore().reload();
                        grid.getSelectionModel().deselectAll();
                    });
                } else {
                    Ext.ux.Msg.info('发布失败，请稍候再试...', function () {
                        grid.getStore().reload();
                        grid.getSelectionModel().deselectAll();
                    });
                }
            }


        });

    },

    /**
     *
     * @param view
     * @param params
     *
     * {
     *  xtype:'',
     *  window:true, // 表示传过来的组件本身就是window
     *  openWindow:true, // 表示要嵌在window中
     *  windowCfg:{},
     *  targetCfg:{}
     * }
     *
     */
    setCurrentView: function (options) {
        options = Ext.apply({
            xtype: 'panel',
            window: false,
            openWindow: false,
            inWindow: false,
            windowCfg: {},
            targetCfg: {}
        }, options);

        var xtype = options.xtype,
            window = options.window,
            inWindow = options.inWindow,
            openWindow = options.openWindow,
            windowCfg = options.windowCfg,
            targetCfg = options.targetCfg;

        if (inWindow) {
            var cfg = Ext.apply({
                xtype: 'basewindow',
                items: [
                    Ext.apply({
                        xtype: xtype
                    }, targetCfg)
                ]
            }, windowCfg);

            Ext.create(cfg);

        } else if (openWindow) {

            var cfg = Ext.apply({
                xtype: 'basewindow',
                autoShow: true
            }, windowCfg);

            Ext.create(cfg);

        } else if (window) {
            var cfg = Ext.apply({
                xtype: xtype,
                autoShow: true

            }, targetCfg);


            Ext.create(cfg);
        } else {
            Ext.log('setCurrentView 调用参数错误');
        }

    }
});
