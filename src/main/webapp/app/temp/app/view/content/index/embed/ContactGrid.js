Ext.define('Admin.view.content.index.embed.ContactGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'content-index-embed-contact-mgrid',

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
                    url: '/cn/article/articleForId?id=4',
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    }
                },
                autoLoad: true
            }),
            columns: [
                {
                    text: 'ID',
                    dataIndex: 'id',
                    hidden: true
                },
                {
                    text: '项目',
                    dataIndex: 'key',
                    width: 250,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    text: '内容',
                    dataIndex: 'value',
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