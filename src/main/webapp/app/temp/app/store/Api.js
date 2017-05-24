Ext.define('Admin.store.API', {
    extend: 'Ext.data.Store',
    alias: 'store.api',

    remoteFilter: true, // 远程过滤
    pageSize: 50,

    proxy: {
        type: 'api'
    },

    constructor: function(config) {

        this.callParent([config]);
    }
});

