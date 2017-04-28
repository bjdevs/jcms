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
            click: 'onBtnClicked'
        },
        '#nav button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onBeforeRender: function (panel, eOpts) {
        this.onRefresh(panel);

    },
    onRefreshBtnClicked: function () {
        this.onRefresh(this.getView());
    },

    onRefresh: function (panel) {
        var ctrl = this,
            view = ctrl.getView(),

            navType = view.id.split('-'),
            navType = navType[navType.length - 1];

        Ext.Ajax.request({
            url: navType == 'main' ? 'data/mainnav.json' : 'data/subnav.json'
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
        form.findField('id').setValue(record['id']);
        form.findField('content').setValue(record['content']);
    },

    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: 'data/ajax.json?' + button.action
        });
    },
    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),

            ownerView = view.up();// nav


        var form = view.down('form').getForm();

        ctrl.formSubmit(form, {
            url: 'data/ajax.json' // todo edit
        }, function (form, action) {
            Ext.ux.Msg.info('保存成功', function () {

                view.hide();

               ctrl.onRefresh(ownerView);

            });
        });
    }

});
