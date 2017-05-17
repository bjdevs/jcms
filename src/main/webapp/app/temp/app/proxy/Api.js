Ext.define('Admin.proxy.API', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.api',

    // 更改默认分页参数名
    pageParam: 'pageNo',
    limitParam: 'pageSize',

    reader: {
        type: 'json',
        rootProperty: function(data) {
            return data.rows || data;
        },
        totalProperty: 'total',
        keepRawData: true // 保持后台返回的其它值,非field:[]
    },
    writer: {
        type: 'json',
        writeAllFields: true // 发送所有字段, 默认为false,只发送已修改字段
    },
    constructor: function(config) {
        this.callParent([config]);
    }
});