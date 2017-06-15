Ext.define('Admin.view.content.index.nav.NavController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.content-index-nav',

    module: 'content-index-nav',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {

        '#nav': {
            beforerender: 'onBeforeRender'
        },

        '#nav button[action=audit]': {
            click: 'onBtnClicked'
        },
        '#nav button[action=rework]': {
            click: 'onBtnClicked'
        },
        '#nav button[action=edit]': {
            click: 'onEditBtnClicked'
        },
        '#nav button[action=release]': {
            click: 'onBtnClickedRelease'
        },
        '#nav button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }

    },

    /*重置*/
    onResetBtnClickedNav: function (button) {
        var id = button.up().up().up().up().id;
        id = id.split('-');
        id = id[id.length - 1];
        var type = id == 'sub' ? 'deputy' : 'main';
        var content = button.up().up().query('[name=content]')[0];
        Ext.Ajax.request({
            method: 'POST',
            url: '/cn/article/resetNav',
            params: {
                type: type
            },
            success: function (response) {
                var data = JSON.parse(response.responseText);
                if (data.success) {
                    content.setValue(data.nav);
                }
            }
        });
    },

    onBtnClickedRelease: function () {
        var type = location.hash;
        type = type.split('-');
        type = type[type.length - 1];
        type = type == "main" ? 1 : 2;

        Ext.Ajax.request({
            url: '/cn/article/create/nav',
            method: 'POST',
            params: {
                id: type
            },
            waitMsg: '正在发布，请稍候...',
            success: function (response) {
                var data = response.responseText;
                data = JSON.parse(data).success;
                if (data == true) {
                    Ext.ux.Msg.info('发布成功', function () {
                    });
                } else if (data == "error") {
                    Ext.ux.Msg.info('发布失败，只有已签状态才可执行该操作', function () {
                    });
                } else {
                    Ext.ux.Msg.info('审核失败，' + result, function () {
                    });
                }
            }


        });
    },

    onBeforeRender: function (panel, eOpts) {
        this.onRefresh(panel);
    },
    onRefreshBtnClicked: function () {
        //  刷新显示有问题
        var view = this.getView();
        this.onRefresh(view);
    },

    onRefresh: function (panel) {
        var ctrl = this,
            view = ctrl.getView(),

            navType = view.id.split('-'),
            navType = navType[navType.length - 1];
        Ext.Ajax.request({
            url: navType == 'main' ? '/cn/article/articleForId?id=1' : '/cn/article/articleForId?id=2'
        }).then(function (response, opts) {
                var obj = Ext.decode(response.responseText);
                panel.setHtml(obj);

                var status = obj['status'],
                    statusText = '', statusColor = '';
                switch (status) {
                    case 0:
                        statusColor = '#0066FF';
                        statusText = '初稿';
                        break;
                    case 1:
                        statusColor = 'blank';
                        statusText = '已签';
                        break;
                    case 5:
                        statusColor = '#FF6633';
                        statusText = '返工';
                        break;
                    case 9:
                        statusColor = 'blank';
                        statusText = '已发';
                        break;
                    case 10:
                        statusColor = 'red';
                        statusText = '已删';
                        break;
                }

                obj['statusText'] = statusText;
                obj['statusColor'] = statusColor;

                ctrl.lookupReference('status').setHtml(obj);
                panel.data = obj;
            },
            function (response, opts) {
                Ext.log('server-side failure with status code ' + response.status);
            });
    },

    onEditBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),

            navType = view.id.split('-'),
            navType = navType[navType.length - 1],

            winReference = 'content-index-nav-mform-' + navType,
            win = ctrl.lookupReference(winReference);

        if (!win) {
            win = Ext.create({
                reference: winReference,
                xtype: 'content-index-nav-mform'
            });

            view.add(win);
        }

        win.setTitle('修改内嵌');

        win.show();

        // render
        var record = view.down('#nav').data,
            form = win.down('form').getForm();
        var content = record['content'].replace(/,/g, "\n");

        form.findField('id').setValue(record['id']);
        form.findField('content').setValue(content);
    },

    /**
     * 审核导航
     * @param button
     */
    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');
        var type = location.hash;
        type = type.split('-');
        type = type[type.length - 1];
        type = type == "main" ? 1 : 2;
        Ext.Ajax.request({
            url: '/cn/article/auditArticleForId',
            method: 'POST',
            params: {
                id: type
            },
            success: function (response) {
                var data = response.responseText;
                data = JSON.parse(data).success;
                if (data == true) {
                    Ext.ux.Msg.info('审核成功', function () {
                    });
                } else if (data == "error") {
                    Ext.ux.Msg.info('审核失败，只有返工状态才可执行该操作', function () {
                    });
                } else {
                    Ext.ux.Msg.info('审核失败，' + result, function () {
                    });
                }
            }
        });
    },
    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();// nav

        var form = view.down('form').getForm();

        ctrl.formSubmit(form, {
            url: '/cn/article/updateArticleForId' // todo edit
        }, function (form, action) {
            Ext.ux.Msg.info('保存成功', function () {

                view.hide();
                // 保存之后刷新显示有问题
                // ctrl.onRefresh(ownerView);
            });
        });
    }

});
