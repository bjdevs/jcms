Ext.define('Admin.view.common.charts.BaseChart', {
    extend: 'Ext.Panel',

    // width: 620,
    height: 580,
    layout: 'fit',

    //border: false,
    bodyPadding: 5,

    platformConfig: {
        classic: {
            headerPosition: 'top'
        },
        modern: {
            header: {
                docked: 'top'
            }
        }
    },


   /* defaults: {
        width: '100%'
    },*/

    collapsible: true, // 可展开 or 收起
    titleCollapse: true // 点击标题 展开 or 收起
});
