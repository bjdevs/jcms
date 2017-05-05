Ext.define('Admin.controller.ViewController', {
    extend: 'Ext.app.ViewController',
    //xtype: 'base-vctrl',

    config: {
        url: '',
        searchPrefix: 'search-',
        searchGridSuffix: '-mgrid'
    },

    getContentPanel: function () {
        return Admin.app.getController('AppController').getContentPanel();
    },
    getLastView: function () {
        return Admin.app.getController('AppController').lastView;
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

    },

    /**
     * 重置表单
     * @param button
     */
    resetForm: function () {
        this.getView().down('form').getForm().reset();
    },
    /**
     * 提交表单 - 只适用Window-Form
     */
    submitWindowForm: function (options) {
        options = Ext.apply({
            refreshGrid: null,
            submitCfg: {}
        }, options);


        var ctrl = this,
            view = ctrl.getView(),// window-form
            refreshGrid = options.refreshGrid,
            submitCfg = options.submitCfg;

        var form = view.down('form').getForm();

        if (form.isValid()) {

            var cfg = Ext.apply({
                submitEmptyText: false, // 不发送空值,默认会发送
                url: ctrl.options['url']['default'],
                waitMsgTarget: true,
                waitTitle: '请稍候...',
                params: {
                    method: 'save'
                },
                success: function (form, action) {
                    Ext.ux.Msg.info('提交成功', function () {
                        view.hide();
                        form.reset();
                        ctrl.refreshStore(refreshGrid);
                    });
                },
                failure: ctrl.msg.form.failure

            }, submitCfg);

            form.submit(cfg);
        }
    },


    /**
     * 刷新gridStore
     * @param refreshGrid
     */
    refreshStore: function (refreshGrid) {

        var ctrl = this,
            view = ctrl.getView(),
            xtype = view.xtype,
            grid = !view.ownerGrid ? view.down(xtype + ctrl.getSearchGridSuffix()) : view,
            grid = refreshGrid ? refreshGrid : grid;

        if (!grid) {
            Ext.log('refreshGrid为空,无法刷新store');
            return;
        }

        // 需要重置pageNo
        var store = grid.getStore();
        store.getProxy().setExtraParam('page', 1);
        store.reload();

        grid.getSelectionModel().deselectAll();
    },

    /**
     * Ext.Ajax.Request - grid record
     * @param options
     *
     * {
     *   operateGrid:xx, // 当前操作的GridPanel
     *   refreshGrid:xx, // 操作完毕需要刷新的Grid '' ? = refreshGrid
     *   type:'item' or 'id', // 数据类型 '' ? = 'id'
     *   text:'删除', // 中文 , 用于弹窗提示
     *   action:'delete' // 英文 , 用于请求method,
     *   ajaxCfg:{}
     *
     * }
     */
    ajaxRequestByType: function (options) {
        // providerPrice
        // this.getView() = providerPrice-mgrid
        // ownerCt = provider
        // ownerLayout = border
        // ownerGrid = providerPrice-mgrid

        // provider
        // this.getView() = provider
        // ownerCt = contentPanel
        // ownerLayout = card
        // ownerGrid = null


        // 特殊布局请主动传参
        var ctrl = this,
            view = ctrl.getView(),
            xtype = view.xtype,
            grid = !view.ownerGrid ? view.down(xtype + ctrl.getSearchGridSuffix()) : view;

        options = Ext.apply({
            operateGrid: grid,
            refreshGrid: grid,
            text: '操作成功',
            type: 'id',
            ajaxCfg: {}
        }, options);

        var
            operateGrid = options.operateGrid,
            refreshGrid = options.refreshGrid,
            text = options.text,
            action = options.action,
            type = options.type,
            ajaxCfg = options.ajaxCfg,
            data = [], ids = [];

        if (!action) {
            Ext.log('缺少action参数');
            return;
        }


        if (type === 'id') {

            Ext.each(operateGrid.getSelection(), function (item, index, allItems) {


                if (item.id !== 0) {
                    ids.push(item.id);
                }
            });

            if (ids.length == 0) return;


        } else if (type === 'item') {

            Ext.each(operateGrid.getSelection(), function (item, index, allItems) {
                if (item.dirty) {
                    data.push(item.data);
                }
            });

            if (data.length == 0) return;

        }

        var cfg = Ext.apply({
            url: ctrl.options['url']['default'],
            params: {
                method: action,
                data: Ext.util.JSON.encode(data),
                ids: ids
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);

                var success = obj['success'],
                    msg = obj['msg'];

                if (success) {
                    Ext.MessageBox.show({
                        title: '提示',
                        msg: text + '成功',
                        buttons: Ext.MessageBox.OK,
                        fn: function () {
                            ctrl.refreshStore(refreshGrid);
                        },
                        icon: Ext.MessageBox.INFO
                    });
                } else {
                    ctrl.msg.ajax.failure(response, opts);
                }
            },
            failure: ctrl.msg.ajax.failure
        }, ajaxCfg);


        if (type === 'id') {
            Ext.MessageBox.confirm('提示', '共选中【' + ids.length + '】项，确定要' + text + '吗?', function (result) {
                if (result === 'no') return;

                Ext.Ajax.request(cfg);
            });
        } else {

            Ext.Ajax.request(cfg);
        }


    },

    /**
     * search-panel 查询
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
            }

            filters.push({
                property: key,
                value: value
            });
        });

        store.filter(filters);
    },
    /**
     * search-panel 清除查询条件
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
     * 修改按钮点击后
     */
    onUpdateBtnClicked: function () {
        var ctrl = this,

            view = ctrl.getView(),
            viewModel = ctrl.getViewModel();

        var win = view.lookup(view.xtype + '-mform');

        var className = view.$className,
            namespace = className.substring(0, className.lastIndexOf('.'));

        if (!win) {
            win = Ext.create(namespace + '.MainForm', {
                reference: view.xtype + '-mform',

                viewModel: viewModel

            });

            view.add(win); // 这里暂时先放入此view , 还有bug待处理
        }

        win.show();


        var grid = view.xtype.indexOf('-mgrid') == -1 ? view.down(view.xtype + '-mgrid') : view,
            record = grid.getSelection()[0];
        win.down('form').getForm().loadRecord(record);

    },


    // todo 后期应改成拓展方法
    msg: {
        form: {
            failure: function (form, action) {
                var msg = action.result ? action.result.msg : '提交失败';

                Ext.MessageBox.show({
                    title: '错误提示',
                    msg: msg,
                    buttons: Ext.MessageBox.OK,
                    //scope: this,
                    icon: Ext.MessageBox.ERROR
                });
            }
        },
        ajax: {
            failure: function (response, opts) {
                var obj = Ext.decode(response.responseText);

                var msg = obj['msg'] ? obj['msg'] : '操作失败';

                Ext.MessageBox.show({
                    title: '错误:' + response.status,
                    msg: msg,
                    buttons: Ext.MessageBox.OK,
                    //scope: this,
                    icon: Ext.MessageBox.ERROR
                });
            }
        }
    },


    alert: {
        error: function (msg, callback) {
            this.customer(Ext.MessageBox.ERROR, msg, callback);
        },
        warn: function (msg, callback) {
            this.customer(Ext.MessageBox.OK, msg, callback);
        },
        info: function (msg, callback) {
            this.customer(Ext.MessageBox.INFO, msg, callback);
        },
        customer: function (icon, msg, callback) {
            if (typeof msg === 'function') {
                callback = msg;
                msg = '提交成功';
            }
            Ext.MessageBox.show({
                title: '提示', // 默认标题
                msg: msg ? msg : '提交成功', // 默认 msg : '提交成功'
                buttons: Ext.MessageBox.OK,
                //scope: this,
                fn: callback ? callback : {},
                icon: icon
            });
        }
    },


    sysdate: function () {
        return new Date(_ADMIN.sysdate);
    },


    /**
     * ********************* 通用操作 *************************
     */

    /**
     * grid - 新增
     */
    onAddBtnClicked: function () {
        var module = this.options['module'];
        if (!module) {
            Ext.log(this.alias + '未设置 module');
            return;
        }
        this.setCurrentView({
            xtype: module + '-mform',
            window: true
        });
    },
    /**
     * grid - 保存
     * @param button
     */
    onSaveBtnClicked: function (button) {
        this.ajaxRequestByType({
            text: button.text,
            action: button.action,
            type: 'item'
        });
    },
    /**
     * grid - 批量操作
     * @param button
     */
    useIdsAjax: function (button) {
        Ext.msg.alert(button.text);
        if (1 == 1){
            Ext.log('请')
        }


        this.ajaxRequestByType({
            text: button.text,
            action: button.action
        });
    },
    /**
     * grid - 刷新
     * @param button
     */
    onRefreshBtnClicked: function (button) {
        this.refreshStore();
    },

    /**
     * form - 重置
     * @param button
     */
    onResetBtnClicked: function (button) {
        this.resetForm();
    }

    /**
     * ********************* 通用操作 *************************
     */

});
