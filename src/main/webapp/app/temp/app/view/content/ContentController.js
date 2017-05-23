Ext.define('Admin.view.content.ContentController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.content',

    module: 'content',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {
        'content-sp button[action=search]': {
            click: 'onSearchPanelQuery'
        },
        'content-sp button[action=reset]': {
            click: 'onSearchPanelReset'
        },

        'content-mgrid': {
            selectionchange: 'onSelectionChange',
            itemclick: 'onItemClick'
        },

        'content-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'content-mgrid button[action=audit]': {
            click: 'onBtnClicked'
        },
        'content-mgrid button[action=rework]': {
            click: 'onBtnClicked'
        },
        'content-mgrid button[action=move]': {
            click: 'onBtnClicked'
        },
        'content-mgrid button[action=delete]': {
            click: 'onBtnClicked'
        },
        'content-mgrid button[action=release]': {
            click: 'onBtnClicked'
        },
        'content-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        },
        'content-mgrid button[action=content-headline-text]': {
            click: 'onTextHeadLineBtnClicked'
        },
        'content-mgrid button[action=content-headline-picture]': {
            click: 'onPictureHeadLineBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // news
            viewModel = ctrl.getViewModel() || {};

        var newsGrid = view.down('content' + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        newsGrid.down('button[action=audit]').setDisabled(count < 1);
        newsGrid.down('button[action=rework]').setDisabled(count < 1);
        newsGrid.down('button[action=move]').setDisabled(count < 1);
        newsGrid.down('button[action=delete]').setDisabled(count < 1);
        newsGrid.down('button[action=release]').setDisabled(count < 1);
    },

    onItemClick: function (grid, record, item, index, e, eOpts) {
        var ctrl = this,
            view = ctrl.getView();

        var target = e.target;
        if (!target) return;

        var action = target.getAttribute('action'),

            category = view.id.split('-'),
            category = category[category.length - 1];

        switch (action) {
            case 'set-text-headline':

                var winReference = 'content-headline-text-mform-' + category,

                    win = ctrl.lookupReference(winReference);

                if (!win) {
                    win = Ext.create({
                        xtype: 'content-headline-text-mform',

                        reference: winReference
                    });
                    view.add(win);
                }

                win.setTitle('新增文字头条');
                win.show();

                // render
                win.down('form').getForm().loadRecord(record);

                break;
            case 'set-picture-headline':

                var winReference = 'content-headline-picture-mform-' + category,
                    win = ctrl.lookupReference(winReference);


                if (!win) {
                    win = Ext.create({
                        xtype: 'content-headline-picture-mform',

                        reference: winReference
                    });


                    view.add(win);
                }

                win.setTitle('新增图片头条');
                win.show();

                // render
                win.down('form').getForm().loadRecord(record);

                break;
        }


    },
    onAddBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),

            category = view.id.split('-'),
            category = category[category.length - 1],

            winReference = 'content-mform-' + category,

            win = ctrl.lookupReference(winReference);

        if (!win) {
            win = Ext.create({
                xtype: 'content-mform',
                reference: winReference,
                id: category
            });

            view.add(win);
        }

        win.setTitle('【' + view.getTitle() + '】新增文章');
        win.show();
    },

    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/article/articleButton?' + button.action
        });
    },

    onTextHeadLineBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),

            category = view.id.split('-'),
            category = category[category.length - 1],

            winReference = 'content-headline-text-win-' + category;

        var win = ctrl.lookupReference(winReference);

        if (!win) {
            win = Ext.create({
                xtype: 'headlinewindow',

                reference: winReference,

                viewModel: {
                    data: {
                        category: category,
                        categoryName: view.getTitle(),
                        subItem: 'content-headline-text-mgrid',
                        type: 'text'
                    }
                }
            });

            view.add(win);
        }

        win.show();
    },
    onPictureHeadLineBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),

            category = view.id.split('-'),
            category = category[category.length - 1],

            winReference = 'content-headline-picture-win-' + category;

        var win = ctrl.lookupReference(winReference);

        if (!win) {
            win = Ext.create({
                xtype: 'headlinewindow',
                reference: winReference,

                viewModel: {
                    data: {
                        category: category,
                        categoryName: view.getTitle(),
                        subItem: 'content-headline-picture-mgrid',
                        type: 'picture'
                    }
                }
            });

            view.add(win);
        }

        win.show();
    },
    /*提交按钮*/
    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();
        var form = view.down('form').getForm();

        if (form.isValid()) {
            form.submit({
                url: '/cn/article/createArticle',
                method: 'POST',
                params: {
                    content: editor.isEmpty() ? "" : editor.html(),
                    category: view.id,
                    userId: _am.currentUser.id,
                    authorStr: _am.currentUser.name
                },
                waitMsg: '正在提交中，请等待片刻...',
                submitEmptyText: false,
                success: function (_from, action) {
                    var result = action.result.result;
                    var success = action.result.success;
                    if (success) {
                        Ext.MessageBox.show({
                            title: '操作提示',
                            closable: 'true',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO,
                            align: 'center',
                            message: '文章创建成功',
                            fn: function (buttonId) {
                                view.hide();
                                editor.html("");
                                var store = view.up().down('grid').getStore();
                                store.getProxy().setExtraParam('page', 1);
                                store.reload();
                            }
                        });
                    } else {
                        Ext.MessageBox.show({
                            title: '文章创建失败,请刷新重试',
                            closable: 'true',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR,
                            align: 'center',
                            message: result,
                            fn: function (buttonId) {
                                editor.html("");
                            }
                        });
                    }
                }

            });
        }
    },
    /*取消移动*/
    moveBtnCancel: function (button) {
        var checkedArray = this.getView().down('treepanel').getChecked();
        if (checkedArray.length > 0) {
            Ext.each(checkedArray, function (node) {
                node.set("checked", false);
            })
        }
        this.getView().down('treepanel').up('move-window').hide();
    },

    /* 处理复选框单选 */
    onBeforeCheckChange: function (record, checkedState, e) {
        var checkedArray = this.getView().down('treepanel').getChecked();
        if (!checkedState) {
            if (checkedArray.length > 0) {
                Ext.each(checkedArray, function (node) {
                    node.set("checked", false);
                })
            }
        }
    },
    /* 确认移动*/
    submitBtnOK: function () {
        var grid = this.getView().up().down('grid');
        var view = this.getView();

        var idArray = grid.getSelection();
        var ids = new Array();
        for (var i = 0; i < idArray.length; i++) {
            ids[i] = idArray[i].id;
        }

        var checkedArray = view.down('treepanel').getChecked();
        if (checkedArray.length > 0) {
            Ext.each(checkedArray, function (node) {
                var categoryId = node.data.viewType;
                categoryId = categoryId.split("-");
                categoryId = categoryId[categoryId.length - 1];
                Ext.Ajax.request({
                    url: '/cn/article/articleChangeCategory',
                    method: 'POST',
                    params: {
                        category: categoryId,
                        ids: ids
                    },
                    waitMsg: '正在移动中，请等待片刻...',
                    submitEmptyText: false,
                    success: function (response, opts) {
                        var result = JSON.parse(response.responseText);
                        console.log(result);
                        console.log(response);
                        if (result) {
                            Ext.MessageBox.show({
                                title: '操作提示',
                                closable: 'true',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                align: 'center',
                                message: '文章移动完成',
                                fn: function (buttonId) {
                                    view.hide();
                                }
                            });
                        } else {
                            Ext.MessageBox.show({
                                title: '操作提示',
                                closable: 'true',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR,
                                align: 'center',
                                message: '文章移动失败，请刷新重试',
                                fn: function (buttonId) {
                                    view.hide();
                                }
                            });
                        }
                        var store = grid.getStore();
                        store.getProxy().setExtraParam('page', 1);
                        store.reload();
                    }
                });
            })
        }
    }

});
