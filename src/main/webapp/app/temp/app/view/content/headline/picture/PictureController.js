Ext.define('Admin.view.content.headline.picture.PictureController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.content-headline-picture',

    module: 'content-headline-picture',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {

        'content-headline-picture-mgrid': {
            selectionchange: 'onSelectionChange'
        },

        'content-headline-picture-mgrid button[action=save]': {
            click: 'onSaveBtnClicked'
        },
        'content-headline-picture-mgrid button[action=delete]': {
            click: 'onBtnClicked'
        },
        'content-headline-picture-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        },
        'content-headline-picture-mgrid button[action=content-headline-picture]': {
            click: 'onPictureHeadLineBtnClicked'
        }
    },

    onAddImgPictureHeadLineBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('pic-mform');

        if (!win) {
            win = Ext.create({
                reference: 'pic-mform',
                xtype: 'pic-mform'
            });

            view.add(win);
        }

        win.setTitle('新增');
        win.show();
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView();

        var module = ctrl['module'],
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        view.down('button[action=save]').setDisabled(count < 1);
        view.down('button[action=delete]').setDisabled(count < 1);
    },

    onSaveBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        var selected = grid.getSelection();
        if (selected.length == 0) {
            return;
        }
        var id = selected[0].data.id;
        var status = selected[0].data.status;
        var redStatus = selected[0].data.redStatus;
        var cateOrderBy = selected[0].data.cateOrderBy;
        var name = selected[0].data.name;

        // todo edit
        ctrl.sendAjaxFromData(button.action, button.text, grid, {
            url: '/cn/article/updateHeadLine?' + button.action +
            '&id=' + id + '&status=' + status + '&redStatus=' + redStatus +
            '&cateOrderBy=' + cateOrderBy + '&name=' + name
        });
    },

    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        var account = _am.currentUser.account;
        
        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/article/headLineBtn?' + button.action + '&type=2&account=' + account
        });
    },

    onPictureHeadLineBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),// picture-mgrid

            ownerView = view.up().up(),// content
            ownerCtrl = ownerView.getController(), // content

            category = ownerView.id.split('-'),
            category = category[category.length - 1],

            winReference = 'content-headline-picture-win-' + category;

        view.up().hide(); // 关闭当前窗口,再打开新窗口

        var win = ownerCtrl.lookupReference(winReference);

        if (!win) {
            win = Ext.create({
                xtype: 'headlinewindow',
                reference: winReference,

                viewModel: {
                    data: {
                        category: category,
                        categoryName: ownerView.getTitle(),
                        subItem: 'content-headline-picture-mgrid',
                        type: 'picture'
                    }
                }
            });

            ownerView.add(win);
        }
        win.show();
    },
    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),

            ownerView = view.up();// content


        var form = view.down('form').getForm();

        var id = view.query('[name=id]')[0].value;

        var userId = _am.currentUser.id;

        ctrl.formSubmit(form, {
            url: '/cn/article/createHeadLine?id=' + id + '&type=2&userId=' + userId
        }, function (form, action) {
            Ext.ux.Msg.info('保存成功', function () {

                view.hide();

                var grid = ownerView.down('grid'),
                    store = grid.getStore();

                store.reload();

                grid.getSelectionModel().deselectAll();

            });
        });
    },
    onSubmitPicBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var form = view.down('form').getForm();
        if (form.isValid()) {
            form.submit({
                url: "/cn/admin/mediaCreate",
                method: "POST",
                submitEmptyText: false,
                waitMsg: '上传中，稍等片刻...',
                success: function (_form, action) {
                    var result = action.result.result;
                    switch (result) {
                        case 'success' :
                            Ext.Msg.alert("提示", "更新成功", function(buttonId, text, opt){
                                view.hide();
                                var url = action.result.url;
                                console.log(url);
                                var mform = button.up().up().up().up().up().down('content-headline-picture-mform');
                                var img = mform.query('[name=image]');
                                var imgPath = mform.query('[name=imageUpload]');
                                imgPath[0].setValue(url);
                                img[0].getEl().dom.src = url;
                            }).setIcon(Ext.Msg.INFO);
                            break;
                        case 'failed' :
                            Ext.Msg.alert("更新失败", action.result.message).setIcon(Ext.Msg.WARNING);
                        default :
                            break;
                    }
                },
                failure: function (_form, action) {
                    Ext.Msg.alert("错误", "服务器端异常，请联系管理员").setIcon(Ext.Msg.ERROR);
                }
            });
        }
    }
});
