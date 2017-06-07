Ext.define('Admin.view.content.index.embed.Fawu', {
    extend: 'Ext.panel.Panel',
    xtype: 'content-index-embed-fawu',

    requires: [
        'Admin.view.content.index.embed.FawuController'
    ],
    controller: 'content-index-embed-fawu',

    scrollable: true,
    defaults: {
        bodyPadding: '8 10',
        border: false
    },

    initComponent: function () {
        var me = this;

        var type = location.hash.split('-'),
            type = type[type.length - 1];
        switch (type) {
            case "short": // 短期出家
                type = 5;
                break;
            case "temple": // 入寺须知
                type = 6;
                break;
            case "buddha": // 礼佛须知
                type = 7;
                break;
        }

        Ext.apply(me, {
            xtype: 'form',
            defaults: {
                anchor: '100%',
                labelAlign: 'right',
                msgTarget: 'side'
            },

            bodyPadding: 10,
            items: [
                {
                    xtype: 'displayfield',
                    itemId: 'd-content',
                    name: 'content',
                    listeners: {
                        beforerender: function (filed) {
                            Ext.Ajax.request({
                                url: '/cn/article/articleEmbedForId?id=' + type
                            }).then(function (response, opts) {
                                var obj = Ext.decode(response.responseText);
                                filed.setValue("\n" + obj.content);
                            });
                        }
                    }
                },
                {
                    xtype: 'textarea',
                    itemId: 'v-content',
                    name: 'content',
                    hidden: true,
                    width: '100%',
                    height: 260,
                    listeners: {
                        beforerender: function (filed) {
                            Ext.Ajax.request({
                                url: '/cn/article/articleEmbedForId?id=' + type
                            }).then(function (response, opts) {
                                var obj = Ext.decode(response.responseText);
                                filed.setValue(obj.content);
                            });
                        }
                    }
                }
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '取消',
                    hidden: true,
                    iconCls: 'x-fa fa-undo',
                    action: 'cancel'
                },
                {
                    xtype: 'button',
                    text: '保存',
                    hidden: true,
                    iconCls: 'x-fa fa-floppy-o',
                    action: 'save'
                },
                {
                    xtype: 'button',
                    text: '修改',
                    iconCls: 'x-fa fa-recycle',
                    action: 'update'
                },
                {
                    xtype: 'button',
                    text: '发布',
                    iconCls: 'x-fa fa-paper-plane-o',
                    action: 'release'
                }
            ]
        });

        me.callParent();
    }

});