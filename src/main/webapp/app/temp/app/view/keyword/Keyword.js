Ext.define('Admin.view.keyword.Keyword', {
    extend: 'Ext.panel.Panel',
    xtype: 'keyword', // 此处的主视图 xtype = 模块名称

    requires: [
        'Admin.view.keyword.KeywordController',
        'Admin.view.keyword.HotKeywordGrid',
        'Admin.view.keyword.KeywordMainGrid',
        'Admin.view.keyword.KeyWordForm'
    ],

    uses: [],

    controller: 'keyword',

    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    height: '40%',
                    xtype: 'hotkeyword-grid'
                },
                {
                    region: 'south',
                    height: '60%',
                    xtype: 'keyword-mgrid'
                }
            ]
        });

        me.callParent();


    }

});
