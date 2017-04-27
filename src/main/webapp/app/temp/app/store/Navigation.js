Ext.define('Admin.store.Navigation', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.navigation',

    storeId: 'Navigation',

    // So that a leaf node being filtered in
    // causes its parent to be filtered in too.
    filterer: 'bottomup',

    constructor: function (config) {
        var me = this,
            items = [],
            ver = Ext.getVersion().parts;

        me.ver = new Ext.Version(ver[0] + '.' + ver[1] + '.' + ver[2]); // just 3-digits

        items.push(me.getNavItemsContentModule());

        items.push(me.getNavItemsSeralModule());
        items.push(me.getNavItemsReleaseModule());
        items.push(me.getNavItemsCategoryModule());

        items.push(me.getNavItemsMidiaModule());

        items.push(me.getNavItemsAccountModule());
        items.push(me.getNavItemsSystemModule());

        //items.push(me.getNavItemsHiddenModule());

        items = {
            text: 'Login',
            viewType: 'login',
            expanded: true,
            iconCls: 'x-fa fa-home',
            description: '<h2>Welcome To Admgr!</h2>' +
            '此应用用于外购单管理!',
            //split: true,
            children: items
        };

        me.fixUp(items);

        me.callParent([Ext.apply({
            root: items
        }, config)]);


    },

    /**
     * This method is used to fill in missing fields (e.g. iconCls) and also to localize
     * the text and description fields if a translation is available.
     *
     * @param {Object/Object[]} items
     * @param {String} tier
     */
    fixUp: function (items, tier, parent) {
        var me = this,
            item = items,
            i, since;

        if (Ext.isArray(items)) {
            for (i = items.length; i-- > 0;) {
                item = items[i];

                if (item.compat === false) {
                    items.splice(i, 1);
                } else {
                    me.fixUp(item, tier, parent);

                    if (parent && (item.isNew || item.hasNew)) {
                        parent.hasNew = true;
                    }
                }
            }
        } else {
            since = item.since;
            if (since) {
                item.sinceVer = since = new Ext.Version(since);
                item.isNew = since.gtEq(me.ver);
            }

            tier = item.tier || (item.tier = tier || 'standard');

            if (!('iconCls' in item)) {
                item.iconCls = 'icon-' + item.id;
            }

            if (item.children) {
                me.fixUp(item.children, tier, item);
            }
        }
    },


    getNavItemsContentModule: function () {
        // 此处的description属性被用作模块区分

        return {
            text: '内容管理',

            iconCls: 'x-fa fa-newspaper-o',

            expanded: true,

            children: [
                {
                    viewType: 'report-outsource',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '首页',
                    visible: false,
                    children: [
                        {
                            viewType: 'report-outsource',
                            iconCls: 'x-fa fa-file-text-o',
                            text: '主导航',
                            children: [{
                                viewType: 'report-outsource',
                                iconCls: 'x-fa fa-file-text-o',
                                text: '主导航修改',
                                leaf: true
                            }]
                        },
                        {
                            viewType: 'report-outsource',
                            iconCls: 'x-fa fa-file-text-o',
                            text: '次导航',
                            leaf: true
                        },
                        {
                            viewType: 'report-outsource',
                            iconCls: 'x-fa fa-file-text-o',
                            text: '活动通知',
                            leaf: true
                        },

                        {
                            viewType: 'report-outsource',
                            iconCls: 'x-fa fa-file-text-o',
                            text: '广告管理',
                            leaf: true
                        },
                        {
                            viewType: 'report-outsource',
                            iconCls: 'x-fa fa-file-text-o',
                            text: '紫云法务',
                            children: [{
                                viewType: 'report-outsource',
                                iconCls: 'x-fa fa-file-text-o',
                                text: '短期出家',
                                children: [{
                                    viewType: 'report-outsource',
                                    iconCls: 'x-fa fa-file-text-o',
                                    text: '短期出家修改',
                                    leaf: true
                                }]
                            },
                                {
                                    viewType: 'report-outsource',
                                    iconCls: 'x-fa fa-file-text-o',
                                    text: '入寺须知',
                                    leaf: true
                                },
                                {
                                    viewType: 'report-outsource',
                                    iconCls: 'x-fa fa-file-text-o',
                                    text: '礼佛须右',
                                    leaf: true
                                }
                            ]
                        },
                        {
                            viewType: 'report-outsource',
                            iconCls: 'x-fa fa-file-text-o',
                            text: '广种福田',
                            leaf: true
                        },
                        {
                            viewType: 'report-outsource',
                            iconCls: 'x-fa fa-file-text-o',
                            text: '联系我们',
                            leaf: true
                        },
                    ]
                },
                {
                    viewType: 'content-news',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '新闻法讯',
                    split: true,
                    leaf: true
                },
                {
                    viewType: 'content-life',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '生活禅',
                    split: true,
                    leaf: true
                },
                {
                    viewType: 'content-ziyunfoguo',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '紫云佛国',
                    split: true,
                    leaf: true
                },
                {
                    viewType: 'content-',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '神医养生',
                    split: true,
                    leaf: true
                },
                {
                    viewType: 'content-knowledge',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '佛教常识',
                    split: true,
                    leaf: true
                },
                {
                    viewType: 'content-cangjingge',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '藏经阁',
                    split: true,
                    leaf: true
                },
                {
                    viewType: 'content-law',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '紫云法务',
                    split: true,
                    leaf: true
                },
                {
                    viewType: 'content-shuimochanyun',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '水墨禅韵',
                    split: true,
                    leaf: true
                },
                {
                    viewType: 'content-recycle',
                    iconCls: 'x-fa fa-trash',
                    text: '回收站',
                    leaf: true
                }
            ]
        }
    },

    getNavItemsSeralModule: function () {
        return {
            text: '连载管理',

            iconCls: 'x-fa fa-desktop',

            visible: false,

            children: [
                {
                    viewType: 'log',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '连载列表',
                    children: [
                        {
                            viewType: 'debug',
                            iconCls: 'x-fa fa-file-text-o',
                            text: '新增连载',
                            leaf: true
                        }
                    ]
                }
            ]
        };
    },
    getNavItemsReleaseModule: function () {
        return {
            text: '发布管理',

            iconCls: 'x-fa fa-desktop',

            visible: false,

            children: [
                {viewType: 'basicData', iconCls: 'x-fa fa-file-text-o', text: '发布记录', leaf: true}
            ]
        };
    },

    getNavItemsCategoryModule: function () {
        return {
            text: '栏目维护',

            iconCls: 'x-fa fa-bars',

            children: [
                {
                    viewType: 'category',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '目录维护',
                    leaf: true/*,
                 children: [
                 {
                 viewType: 'debug',
                 iconCls: 'x-fa fa-file-text-o',
                 text: '新增目录',
                 leaf: true
                 }
                 ]*/
                },
                {viewType: 'template', iconCls: 'x-fa fa-file-text-o', text: '模板维护', leaf: true},
                {viewType: 'keyword', iconCls: 'x-fa fa-file-text-o', text: '标签维护', leaf: true}
            ]
        };
    },

    getNavItemsMidiaModule: function () {
        return {
            text: '媒体管理',

            iconCls: 'x-fa fa-cog',

            visible: false,

            children: [
                {viewType: 'basicData', iconCls: 'x-fa fa-file-text-o', text: '图片', leaf: true},
                {viewType: 'site', iconCls: 'x-fa fa-file-text-o', text: '音频', leaf: true},
                {viewType: 'setting', iconCls: 'x-fa fa-file-text-o', text: '文档', leaf: true}
            ]
        };
    },

    getNavItemsAccountModule: function () {
        return {
            text: '帐户资料',
            iconCls: 'x-fa fa-user',


            children: [
                {viewType: 'account-setting', iconCls: 'x-fa fa-file-text-o', text: '资料设置', leaf: true},
                {viewType: 'account-editpwd', iconCls: 'x-fa fa-file-text-o', text: '密码修改', leaf: true}
            ]
        };
    },


    getNavItemsSystemModule: function () {
        return {
            text: '系统安全',

            iconCls: 'x-fa fa-lock',


            children: [
                {viewType: 'basicData', iconCls: 'x-fa fa-file-text-o', text: '日志管理', leaf: true, visible: false},
                {viewType: 'site', iconCls: 'x-fa fa-file-text-o', text: '帐户管理', leaf: true, visible: false},
                {viewType: 'auth-role', iconCls: 'x-fa fa-file-text-o', text: '角色管理', leaf: true},
                {viewType: 'setting', iconCls: 'x-fa fa-file-text-o', text: '权限管理', leaf: true, visible: false}
            ]
        };
    },

    getNavItemsHiddenModule: function () {
        return {
            text: '隐藏菜单',

            iconCls: 'x-fa fa-cog',

            description: '此处为隐藏菜单,包含各模块下的子模块,只为提供给hash路由时加载模块使用',

            children: [
                {
                    viewType: 'content-headline-text',
                    iconCls: 'x-fa fa-file-text-o',
                    text: '文字头条',
                    leaf: true,
                    visible: false
                }
            ]
        };
    }

});
