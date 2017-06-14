Ext.define('Admin.view.content.index.nav.Nav', {
    extend: 'Ext.panel.Panel',
    xtype: 'content-index-nav',

    requires: [
        'Admin.view.content.index.nav.NavController',
        'Admin.view.content.index.nav.NavMainForm'

    ],

    controller: 'content-index-nav',

    margin: 5,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    itemId: 'nav',
                    tpl: new Ext.XTemplate(
                        '<div style="list-style: none;">{[this.formatContent(values.content)]}</div>',
                        {
                            formatContent: function (content) {
                                var css = content.split(',');
                                for (var i = 0; i < css.length; i++) {
                                    css[i] = '<div style="float: left;padding:5px 10px;">' + css[i] + '</div>';
                                }

                                return css.join('');
                            }
                        }
                    ),
                    tbar: [
                        {
                            xtype: 'button',
                            text: '审核',
                            iconCls: 'x-fa fa-check-circle-o',
                            // disabled: true,
                            action: 'audit'
                        },
                        /*{
                         xtype: 'button',
                         text: '返工',
                         iconCls: 'x-fa fa-undo',
                         action: 'rework'
                         },*/
                        {
                            xtype: 'button',
                            text: '修改',
                            iconCls: 'x-fa fa-pencil-square-o',
                            action: 'edit'
                        },
                        {
                            xtype: 'button',
                            text: '发布',
                            iconCls: 'x-fa fa-paper-plane-o',
                            action: 'release'
                        },
                        '-',
                        {
                            xtype: 'button',
                            text: '刷新',
                            iconCls: 'x-fa fa-refresh',
                            action: 'refresh'
                        },
                        '->',
                        {
                            xtype: 'component',
                            reference: 'status',
                            tpl: '状态：<span style="color:{statusColor}">{statusText}</span> <!--| 更新人：{updateOne}--> | 更新时间：{updateDate}'

                        }
                    ]
                }
            ]
        });

        me.callParent();


    }

});