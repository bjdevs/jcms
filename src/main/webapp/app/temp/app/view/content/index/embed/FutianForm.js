Ext.define('Admin.view.content.index.embed.FutianForm', {
    extend: 'Admin.view.common.panel.BaseSearchPanel',
    xtype: 'content-index-embed-futian-mform',

    controller: 'content-index-embed-futian',

    bodyPadding: '0px',
    margin: '0 0 0 0',
    initComponent: function () {
        var me = this;

        var form = Ext.create({
            xtype: 'form',
            layout: 'anchor',
            borderStyle: 'none',
            defaults: {
                anchor: '100% 100%'
            },
            width: '100%',
            items: [
                {
                    xtype: 'textarea',
                    name: 'depict',
                    listeners: {
                        beforerender: function (filed) {
                            Ext.Ajax.request({
                                url: '/cn/article/articleForId?id=3'
                            }).then(function (response, opts) {
                                var obj = Ext.decode(response.responseText);
                                filed.setValue("\n"+obj.depict);
                            });
                        }
                    }
                }
            ]
        });

        Ext.apply(me, {
            items: form
        });

        me.callParent();
    }


});
