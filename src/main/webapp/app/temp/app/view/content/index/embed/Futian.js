Ext.define('Admin.view.content.index.embed.Futian', {
    extend: 'Ext.panel.Panel',
    xtype: 'content-index-embed-futian',

    requires: [
        'Admin.view.content.index.embed.FutianController',
        'Admin.view.content.index.embed.FutianGrid',
        'Admin.view.content.index.embed.FutianForm'
    ],

    controller: 'content-index-embed-futian',
    layout: 'border',
    margin: 5,

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [
                {
                    region: 'north',
                    xtype: 'content-index-embed-futian-mform'
                },
                {
                    region: 'center',
                    xtype: 'content-index-embed-futian-mgrid'
                }
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: '审核',
                    iconCls: 'x-fa fa-check-circle-o',
                    action: 'audit'
                },
                {
                    xtype: 'button',
                    text: '保存',
                    iconCls: 'x-fa fa-floppy-o',
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
                    xtype: 'label',
                    tpl: '状态：{statusStr}&nbsp;&nbsp;修改日期：<strong>{updateDate}</strong>',
                    style: {
                        // 'color': 'crimson'
                    },
                    listeners: {
                        beforerender: function (panel, eOpts) {
                            Ext.Ajax.request({
                                url: '/cn/article/getEmbedInfo?id=3'
                            }).then(function (response, opts) {
                                    var obj = Ext.decode(response.responseText);
                                    var status = obj.statusStr;
                                    switch (status) {
                                        case 0:
                                            obj.statusStr = "<strong style='color:#0066FF'>初稿</strong>";
                                            break;
                                        case 1:
                                            obj.statusStr = "<strong style='color: black'>已签</strong>";
                                            break;
                                        case 5:
                                            obj.statusStr = "<strong style='color:#FF6633'>返工</strong>";
                                            break;
                                        case 9:
                                            obj.statusStr = "<strong style='color:#7DB336'>已发</strong>";
                                            break;
                                        default:
                                            obj.statusStr = "<strong style='color:red'>未知</strong>";
                                            break;
                                    }
                                    panel.setHtml(obj);
                                },
                                function (response, opts) {
                                    Ext.log('server-side failure with status code ' + response.status);
                                });
                        }
                    }
                }
            ]
        });

        me.callParent();
    }
});