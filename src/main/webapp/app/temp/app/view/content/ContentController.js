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
        'content-mgrid button[action=update]': {
            click: 'onUpdateBtnClicked'
            // click: 'onAddBtnClicked'
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
        },
        'content-mgrid button[action=preview]': {
            click: 'onPreviewBtnClicked'
        }
    }
    ,

    onUpdateBtnClicked: function (button) {
        var grid = button.up().up(),
            tabPanel = button.up().up().up().up().up().down('contentPanel'),
            selected = grid.getSelection()[0];

        var tab = tabPanel.add({
            id: 'article-' + selected.id,
            title: selected.data.title,
            noRoute: true,
            xtype: 'main-panel-article',
            // html: selected.data.content

        });

        var objects;
        Ext.Ajax.request({
            url: '/cn/article/getArticleKeyWord',
            method: 'POST',
            async: false,
            params: {
                aId: selected.id
            },
            success: function (response) {
                var data = response.responseText;
                var json = JSON.parse(data);
                objects = json.rows;
                var ob = new Array();
                var ob1 = new Array();
                for (var i = 0; i < objects.length; i++) {
                    ob1 = [objects[i].name];
                    ob[i] = ob1;
                }
                objects = ob;
            }
        });
        selected.set("kId", objects);
        tab.getViewModel().data.article = selected;
        tabPanel.setActiveTab(tab);
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // news
            viewModel = ctrl.getViewModel() || {};

        var newsGrid = view.down('content' + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        var auditBtn = true;
        var reworkBtn = true;
        var releaseBtn = false;

        if (count == 0) {
            Ext.log('No selection');
            auditBtn = true;
            reworkBtn = true;
            releaseBtn = false;
        } else {
            /*Ext.each(selected, function (item, index, allItems) {
             var status = item.data.status;
             console.log(status);
             if (status == 0 || status == 5) {
             auditBtn = false;
             } else{
             auditBtn = true;
             }
             console.log(auditBtn);
             });*/

            // auditBtn
            for (var i = 0; i < selected.length; i++) {
                var status = selected[i].data.status;
                if (status == 0 || status == 5) {
                    auditBtn = false;
                } else {
                    auditBtn = true;
                    break;
                }
            }

            // reworkBtn
            for (var i = 0; i < selected.length; i++) {
                var status = selected[i].data.status;
                if (status == 1 || status == 9) {
                    reworkBtn = false;
                } else {
                    reworkBtn = true;
                    break;
                }
            }

            // releaseBtn
            for (var i = 0; i < selected.length; i++) {
                var status = selected[i].data.status;
                if (status == 1) {
                    releaseBtn = false;
                } else {
                    releaseBtn = true;
                    break;
                }
            }

        }

        // 审核：对象是返工和初稿，忽略已发的文章；
        newsGrid.down('button[action=audit]').setDisabled(auditBtn);

        // 返工：对象是已签和已发，忽略初稿和返工；
        newsGrid.down('button[action=rework]').setDisabled(reworkBtn);

        newsGrid.down('button[action=move]').setDisabled(count < 1);
        newsGrid.down('button[action=delete]').setDisabled(count < 1);

        // 发布：对象是已签，忽略初稿、返工、已发。
        newsGrid.down('button[action=release]').setDisabled(releaseBtn);
        newsGrid.down('button[action=preview]').setDisabled(count != 1);
        newsGrid.down('button[action=update]').setDisabled(count != 1);
    },

    onItemClick: function (grid, record, item, index, e, eOpts) {
        var ctrl = this,
            view = ctrl.getView();

        var selected = grid.getSelection();
        var status = selected.length > 0 ? selected[0].data.status : 0;
        var aId = selected.length > 0 ? selected[0].data.id : 0;

        var target = e.target;
        if (!target) return;

        var action = target.getAttribute('action'),

            category = view.id.split('-'),
            category = category[category.length - 1];

        var date = new Date();

        switch (action) {
            case 'set-text-headline':
                if (status != 9) {
                    Ext.ux.Msg.error('请先发布文章，再执行该操作', function () {
                    });
                    return;
                }
                var winReference = 'content-headline-text-mform-' + category + "-" + aId + date.getTime(),

                    win = ctrl.lookupReference(winReference);

                if (!win) {
                    win = Ext.create({
                        xtype: 'content-headline-text-mform',
                        reference: winReference,
                        viewModel: {
                            data: {
                                aId: aId
                            }
                        }
                    });
                    view.add(win);
                }

                win.setTitle('新增文字头条');
                win.show();

                // render
                win.down('form').getForm().loadRecord(record);

                break;
            case 'set-picture-headline':
                if (status != 9) {
                    Ext.ux.Msg.error('请先发布文章，再执行该操作', function () {
                    });
                    return;
                }
                var winReference = 'content-headline-picture-mform-' + category + "-" + aId + date.getTime(),
                    win = ctrl.lookupReference(winReference);


                if (!win) {
                    win = Ext.create({
                        xtype: 'content-headline-picture-mform',
                        viewModel: {
                            data: {
                                aId: aId
                            }
                        },
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


        var selected = null;
        if (button.action == "update") {
            selected = view.down('grid').getSelection();
            if (selected.length == 0) return;
            selected = selected[0];

        }
        var article = selected;

        if (!win) {
            win = Ext.create({
                xtype: 'content-mform',
                reference: winReference,
                id: category
            });

            view.add(win);
        }
        if (button.action == "add") {
            win.setTitle('【' + view.getTitle() + '】新增文章');
        } else {
            var objects;
            Ext.Ajax.request({
                url: '/cn/article/getArticleKeyWord',
                method: 'POST',
                async: false,
                params: {
                    aId: article.id
                },
                success: function (response) {
                    var data = response.responseText;
                    var json = JSON.parse(data);
                    objects = json.rows;
                    var ob = new Array();
                    var ob1 = new Array();
                    for (var i = 0; i < objects.length; i++) {
                        ob1 = [objects[i].name];
                        ob[i] = ob1;
                    }
                    objects = ob;
                }
            });
            var form = view.down('form');
            article.set("kId", objects);
            form.getForm().loadRecord(article);
            win.setTitle('【' + view.getTitle() + '】修改文章');
        }

        win.show();
        if (article != null) editor.html(article.data.content);
        else editor.html("");
    },

    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        var status = grid.getSelection()[0].data.status;
        if (button.text == "发布") {
            if (status == 0 || status == 5) {
                Ext.ux.Msg.error('请先审核，再执行该操作', function () {
                });
                return;
            }

        }

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

        var id = form.getValues().id;
        var msg = "新增";
        if (id) {
            msg = "修改";
        }

        if (form.isValid()) {
            form.submit({
                url: '/cn/article/createArticle',
                method: 'POST',
                params: {
                    content: editor.isEmpty() ? "" : editor.html(),
                    category: view.id,
                    userId: _am.currentUser.id,
                    authorStr: _am.currentUser.name,
                    articleId: id
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
                            message: '文章' + msg + '成功',
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
    },
    onPreviewBtnClicked: function (button) {
        var id = button.up().up().up().down('grid').getSelection()[0].id;

        Ext.Ajax.request({
            method: 'POST',
            url: '/cn/article/articlePreview',
            params: {
                id: id
            },
            success: function (response) {
                var data = response.responseText;
                if (data.indexOf('true') > -1) {
                    var preview = JSON.parse(data);
                    var url = preview.preview;
                    window.open(url);
                } else {
                    Ext.ux.Msg.info('预览失败，请稍候再试...', function () {
                        grid.getStore().reload();
                        grid.getSelectionModel().deselectAll();
                    });
                }
            }
        });
    },

    onCloseBtnClicked: function (button) {
        var mform = button.up().up().up();
        mform.close();
    }

});
