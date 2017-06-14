Ext.define('Admin.view.common.panel.BaseSearchPanel', {
    extend: 'Ext.panel.Panel',

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'begin'

    },

    bodyPadding: '5px',
    margin: '0 0 5px 0',
    defaults: {
        layout: {
            type: 'hbox'
        },
        border: false
    },

    // 自定义
    subDefaults: {
        margin: '5px 5px',
        labelAlign: 'left',
        labelWidth: 60
    },

    /*keyMap: {
        'ENTER': 'onSearchPanelQuery',
        scope: 'controller'
    }*/
});