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
        'content-headline-picture-mgrid button[action=content-headline-text]': {
            click: 'onTextHeadLineBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // text
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        view.down('button[action=save]').setDisabled(count < 1);
        view.down('button[action=delete]').setDisabled(count < 1);
    },

    onSaveBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromData(button.action, button.text, grid, {
            url: 'data/ajax.json?' + button.action
        });
    },

    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: 'data/ajax.json?' + button.action
        });
    },

    onTextHeadLineBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),// picture-mgrid

            ownerView = view.up().up(),// content
            ownerCtrl = ownerView.getController(), // content

            category = ownerView.id.split('-'),
            category = category[category.length],

            winReference = 'content-headline-text-win-' + category;

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
                        subItem: 'content-headline-text-mgrid',
                        type: 'text'
                    }
                }
            });

            ownerView.add(win);
        }

        win.show();
    }
});
