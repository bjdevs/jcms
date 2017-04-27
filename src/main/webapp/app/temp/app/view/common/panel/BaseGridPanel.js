Ext.define('Admin.view.common.panel.BaseGridPanel', {
    extend: 'Ext.grid.Panel',

    //scrollable: true,

    viewConfig: {
        enableTextSelection: true, // grid cell 支持文本复制
        emptyText: '<h3>No matching results</h3>'
    },

    selModel: {
        selType: 'checkboxmodel'
    },
   /* plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 2
    }],*/
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    },
    columnLines: true, // 添加表格线
    loadMask: true, // loading...

    initComponent: function () {
        var me = this;


        me.callParent();
    }


});