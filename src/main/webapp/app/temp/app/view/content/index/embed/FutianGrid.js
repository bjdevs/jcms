Ext.define('Admin.view.content.index.embed.FutianGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'content-index-embed-futian-mgrid',

    selModel: {
        selType: 'cellmodel'
    },
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: '/cn/article/articleForId?id=3'
                },
                autoLoad: true
            }),
            columns: [
                {
                    text: '用途',
                    dataIndex: 'use',
                    align: 'center',
                    flex: 1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: '开户行',
                    dataIndex: 'bank',
                    align: 'center',
                    flex: 1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: '户名',
                    dataIndex: 'user',
                    align: 'center',
                    flex: 1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: '帐号',
                    dataIndex: 'card',
                    align: 'center',
                    flex: 1,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }
            ],
            bbar: ''

        });

        me.callParent();
    }

});