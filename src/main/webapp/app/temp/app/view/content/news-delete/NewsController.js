Ext.define('Admin.view.content.news.NewsController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.content-news',

    module: 'content-news',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {
        'content-news-sp button[action=search]': {
            click: 'onSearchPanelQuery'
        },
        'content-news-sp button[action=reset]': {
            click: 'onSearchPanelReset'
        },

        'content-news-mgrid': {
            selectionchange: 'onSelectionChange',
            itemclick: 'onItemClick'
        },

        'content-news-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'content-news-mgrid button[action=audit]': {
            click: 'onBtnClicked'
        },
        'content-news-mgrid button[action=rework]': {
            click: 'onBtnClicked'
        },
        'content-news-mgrid button[action=move]': {
            click: 'onBtnClicked'
        },
        'content-news-mgrid button[action=delete]': {
            click: 'onBtnClicked'
        },
        'content-news-mgrid button[action=release]': {
            click: 'onBtnClicked'
        },
        'content-news-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        },
        'content-news-mgrid button[action=content-headline-text]': {
            click: 'onTextHeadLineBtnClicked'
        },
        'content-news-mgrid button[action=content-headline-picture]': {
            click: 'onPictureHeadLineBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // news
            viewModel = ctrl.getViewModel() || {};

        var newsGrid = view.down('content-news' + ctrl.getSearchGridSuffix()),
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

        var action = target.getAttribute('action');

        switch (action) {
            case 'set-text-headline':

                var win = ctrl.lookupReference('content-headline-text-mform');

                if (!win) {
                    win = Ext.create({
                        xtype: 'content-headline-text-mform'
                    });

                    view.add(win);
                }

                win.show();

                break;
            case 'set-picture-headline':

                var win = ctrl.lookupReference('content-headline-picture-mform');

                if (!win) {
                    win = Ext.create({
                        xtype: 'content-headline-picture-mform'
                    });

                    view.add(win);
                }

                win.show();

                break;
        }


    },
    onAddBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('content-news-mform');

        if (!win) {
            win = new Admin.view.content.news.NewsMainForm();

            view.add(win);
        }

        win.setTitle('新增文章');
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
            view = ctrl.getView();

        var win = ctrl.lookupReference('content-headline-text-win');

        if (!win) {
            win = Ext.create({
                xtype: 'headlinewindow',
                reference: 'content-headline-text-win',

                viewModel: {
                    data: {
                        category: 'news',
                        categoryName: '新闻法讯',
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
            view = ctrl.getView();

        var win = ctrl.lookupReference('content-headline-picture-win');

        if (!win) {
            win = Ext.create({
                xtype: 'headlinewindow',
                reference: 'content-headline-picture-win',

                viewModel: {
                    data: {
                        category: 'news',
                        categoryName: '新闻法讯',
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
