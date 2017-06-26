Ext.define('expand.overrides.data.proxy.Proxy', {
    override: 'Ext.data.proxy.Proxy',

    listeners: {
        exception: function (proxy, response, operation) {

            var error = operation.getError();

            if (error) {

                var status = error['status'];

                if (proxy.isAjaxProxy) {

                    Ext.ux.Msg.error(
                        '错误状态：' + status + '<br/>' +
                        '错误信息：' + error['statusText'] + '<br/>' +
                        'AjaxURL：' + proxy['url'], 'Load Store Error');

                } else {

                    Ext.ux.Msg.error(
                        '错误状态：' + status + '<br/>' +
                        'AjaxURL：' + proxy['url'] + '<br/>', 'Load Store Error');
                }

                return;
            }


            var obj = Ext.decode(response.responseText),
                msg = obj['msg'] ? obj['msg'] : '系统异常';


            Ext.ux.Msg.error(msg, '错误提示');

        }

    }
});
