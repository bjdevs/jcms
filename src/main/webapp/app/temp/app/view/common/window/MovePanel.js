Ext.define('Admin.view.common.window.MovePanel', {
    extend: 'Admin.view.common.window.MoveWindow',
    xtype: 'moveCategoty-tree',
    alias: 'widget.moveCategoty-tree',

    controller: 'content',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: {
                xtype: 'treepanel',
                checkPropagation: 'both',
                rootVisible: false,
                useArrows: true,
                // id: 'treePanel',
                bufferedRenderer: false,
                animate: true,
                store: {
                    xtype: 'store',
                    proxy: {
                        type: 'ajax',
                        url: 'data/category.json',
                        reader: {
                            type: 'json',
                            rootProperty: 'children'
                        },
                        autoLoad: true
                    }
                },
                listeners: {
                    beforecheckchange: 'onBeforeCheckChange'
                }
            },
            bbar: ['->',
                {
                    xtype: 'button',
                    text: '确定',
                    handler: 'submitBtnOK'
                },
                {
                    xtype: 'button',
                    text: '取消',
                    handler: 'moveBtnCancel'
                }
            ]
        });

        me.callParent();
    }

});