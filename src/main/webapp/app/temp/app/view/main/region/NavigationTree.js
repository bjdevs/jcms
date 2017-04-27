Ext.define('Admin.view.main.region.NavigationTree', {
    extend: 'Ext.tree.Panel',

    xtype: 'navigation-tree',

    id: 'navigation-tree',

    title: '菜单',
    iconCls: 'x-fa fa-bars',

    rootVisible: false, // 不显示根节点
    lines: false, //
    useArrows: true, // 小箭头
    width: 250, 
    height: 200,
    stateful: true,
    stateId: 'mainnav.west',
    collapsible: true, // 可展开 or 收起
    titleCollapse: true, // 点击标题 展开 or 收起
    enableColumnResize: false,
    enableColumnMove: false,

    store: 'navigation'

});