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
            category = category[category.length];


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
            category = category[category.length],

            winReference = 'content-mform-' + category,

            win = ctrl.lookupReference(winReference);

        if (!win) {
            win = Ext.create({
                xtype: 'content-mform',
                reference: winReference
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
            url: 'data/ajax.json?' + button.action
        });
    },

    onTextHeadLineBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),

            category = view.id.split('-'),
            category = category[category.length],

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
            category = category[category.length],

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
    }

});
