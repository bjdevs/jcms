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
                            // reference: 'status',
                            tpl: '状态：{statusStr}&nbsp;&nbsp;修改日期：<strong>{updateDate}</strong>',
                            style: {
                                // 'color': 'crimson'
                            },
                            listeners: {
                                beforerender: function (panel, eOpts) {
                                    var type = location.hash;
                                    type = type.split('-');
                                    type = type[type.length - 1];
                                    type = type == "main" ? 1 : 2;
                                    Ext.Ajax.request({
                                        url: '/cn/article/getEmbedInfo?id=' + type
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
                }
            ]
        });

        me.callParent();


    }

});