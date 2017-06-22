Ext.define('Admin.store.Navigation', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.navigation',

    storeId: 'Navigation',

    // So that a leaf node being filtered in
    // causes its parent to be filtered in too.
    filterer: 'bottomup',

    root: {
        "text": "Login",
        "viewType": "login",
        "expanded": true,
        "iconCls": "x-fa fa-home",
        "description": ""
    },
    proxy: {
        type: 'ajax',
        //url: '/app/temp/data/navs.json',
        url: "/cn/admin/authDataNavs",
        reader: {
            type: 'json',
            rootProperty: 'children'
        },
        autoLoad: true
    },

    listeners: {
        load: function (store, records, successful, operation, node, eOpts) {

            store.each(function (nodeI) {

                var text = nodeI.get('text'),
                    iconCls = nodeI.get('iconCls'),
                    tier = nodeI.get('tier'),
                    split = nodeI.get('split'); // 用于模块区分,如:content-news 调用Content.js,news 为模块类型

                if (!text) {
                    nodeI.remove();
                    return true;

                }

                if (!iconCls)  nodeI.set('iconCls', 'x-fa fa-file-text-o');
                if (!tier) nodeI.set('tier', 'standard');
                if (!split)  nodeI.set('split', false);

            });

        }
    },
    constructor: function (config) {
        var me = this,
            items = [],
            ver = Ext.getVersion().parts;

        me.ver = new Ext.Version(ver[0] + '.' + ver[1] + '.' + ver[2]); // just 3-digits

        // Since records claim the data object given to them, clone the data
        // for each instance.
        config = Ext.apply({
            root: Ext.clone(this.rootData)
        }, config);


        this.callParent([config]);

    }

});
