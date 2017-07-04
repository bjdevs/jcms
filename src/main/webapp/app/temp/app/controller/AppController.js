Ext.define('Admin.controller.AppController', {
    extend: 'Ext.app.Controller',
    namespace: 'Admin',
    requires: [
        // 'Ext.window.*'
    ],

    stores: [
        // 'Thumbnails'
    ],

    config: {
        control: {
            '#': {
                unmatchedroute: 'onRouteChange'
            },
            // tab 改变时也需要改变路由
            'navigation-tree': {
                itemclick: 'onNavigationTreeSelectionChange'
            },
            'contentPanel': {
                'beforeremove': 'onContentPanelSubClose',
                'tabchange': 'positionedchange'
            }

        },
        refs: {
            viewport: 'viewport',
            login: 'login',
            navigationTree: 'navigation-tree',
            contentPanel: 'contentPanel'

        },
        routes: {
            ':node': {
                before: 'onBeforeHandleRoute',
                action: 'onRouteChange'
            }
        }
    },

    lastView: null,

    loginViewType: 'login',


    setCurrentView: function (hashTag) {
        hashTag = (hashTag || '');

        var me = this,
            mainCard = me.getContentPanel(),
            mainLayout = mainCard.getLayout(),
            navigationList = me.getNavigationTree(),
            store = navigationList.getStore(),
            node = store.findNode('routeId', hashTag) ||
                store.findNode('viewType', hashTag),
            view = (node && node.get('viewType')) || 'page404', // errorPage
            lastView = me.lastView,
            existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
            newView;


        if (node.get('split')) {  // 多模块复用同一个页面,通过此属性进行拆分
            var tmps = view.split('-');
            view = tmps.slice(0, tmps.length - 1).join('-');
        }

        /* if(view == 'page404') { // 这里是指没有相关模块,未在navigation.js中添加节点
         location.href = '/jsp/400.jsp';
         }*/

        // Kill any previously routed window
        if (lastView && lastView.isWindow) {
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();
        if (!existingItem) {

            if (node) {
                var title = node.get('text'),
                    iconCls = node.get('iconCls'),
                    description = node.get('description');

                if (hashTag == me.loginViewType) { // window

                    newView = Ext.create({xtype: me.loginViewType});

                } else {
                    try {
                        newView = Ext.create({
                            id: 'main-panel-' + hashTag,
                            xtype: description ? 'panel' : view,
                            html: description ? description : '',
                            title: title,
                            iconCls: iconCls,
                            routeId: hashTag,  // for existingItem search later
                            hideMode: 'offsets'
                        });
                    } catch (e) {
                        Ext.ux.Msg.error(e.message, e.name);
                        return;
                    }
                }

            } else {

                try {
                    newView = Ext.create({
                        xtype: view,
                        routeId: hashTag,  // for existingItem search later
                        hideMode: 'offsets'
                    });
                } catch (e) {
                    Ext.ux.Msg.error(e.message, e.name);
                    return;


                }
            }


        }

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.
            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            }
            else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }

        if (node) {
            // 自动找到菜单并focus
            if (node.isRoot()) {
                navigationList.ensureVisible(0, {
                    focus: true
                });
            } else {
                if (node.parentNode && !node.parentNode.isExpanded()) {
                    node.parentNode.expand();
                }
                navigationList.ensureVisible(node, {
                    focus: true,
                    select: true
                });
            }
        }

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        me.lastView = newView;
    },
    onBeforeHandleRoute: function (id, action) {
        var me = this,
            navigationList = me.getNavigationTree(),
            store = navigationList.getStore(),
            node = store.findNode('viewType', id);

        if (node) {

            action.resume();

        } else if (store.getCount() === 0) {
            //在store load事件中判断节点，避免store数据未加载情况

            store.on('load', function () {

                node = store.findNode('viewType', id);

                if (node) {
                    action.resume();

                } else {

                    Ext.ux.Msg.error('找不到viewType为【' + id + '】 的组件', '路由跳转失败');
                    action.stop();
                }
            });
        } else {

            Ext.ux.Msg.error('找不到viewType为【' + id + '】 的组件', '路由跳转失败');
            action.stop();
        }
    },
    onRouteChange: function (id) {
        this.setCurrentView(id);
    },
    onNavigationTreeSelectionChange: function (tree, node, item, index, e, eOpts) {
        var to = node && (node.get('routeId') || node.get('viewType'));

        if (to) {
            this.redirectTo(to);
        }
    },

    onContentPanelSubClose: function (tabpanel, tab, eOpts) {
        if (tabpanel.items.getCount() == 2) {
            this.redirectTo('');
        } else {
            var items = tabpanel.items,
                itemsLength = items.length,
                tab = items.getAt(itemsLength - 2),
                routeId = tab.routeId;
            if (tab.noRoute === true) return;

            this.redirectTo(routeId);
        }
    },
    positionedchange: function (tabBar, newTab) {
        if (newTab.noRoute === true) return;
        this.redirectTo(newTab.routeId || '');
    }

});
