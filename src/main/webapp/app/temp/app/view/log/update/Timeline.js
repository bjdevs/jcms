Ext.define('Admin.view.log.update.Timeline', {
    extend: 'Ext.DataView',
    xtype: 'profiletimeline',

    cls: 'timeline-items-wrap',

    scrollable: false,


    //bind: '{userTimeline}',
    store: {
        autoLoad: true,
        fields: [
            {
                name: 'name'
            },
            {
                name: 'content'
            },
            {
                name: 'items'
            },
            {
                name: 'date',
                type: 'date'
            }
        ],
        proxy: {
            type: 'ajax',
            url: '~api/sysupdatelog'
        }
    },

    itemSelector: '.timeline-item',

    itemTpl: [
        '<div class="timeline-item{xindex:this.cls(values,parent[xindex-2],xindex-1,xcount)}">' +
        '<div class="profile-pic-wrap">' +
        '<div class="timeline-epoch">{date:this.format}</div>' +
        '</div>' +
        '<div class="line-wrap">' +
        '<div class="contents-wrap">' +
        '<div class="shared-by"><a href="#">{module}</a> {name}</div>' +
        '<div>' +
        '<tpl if="items && items.length">' +
        '   <ul>' +
        '       <tpl for="items">' +
        '           <tpl foreach=".">' +
        '               <li>{.}</li>' +
        '           </tpl>' +
        '       </tpl>' +
        '   </ul>' +
        '<tpl else>' +
        '   {content}' +
        '</tpl>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>',
        {
            cls: function (value, record, previous, index, count) {
                var cls = '';

                if (!index) {
                    cls += ' timeline-item-first';
                }
                if (index + 1 === count) {
                    cls += ' timeline-item-last';
                }

                return cls;
            },

            format: function (value) {
                //'a' instanceof Date

                if (value instanceof Date) {
                    return Ext.Date.format(value, 'Y/m/d');
                }
            },

            part: function (value, type, gap) {
                var ret = value ? (gap || '') + value + ' ' + type : '';
                if (value > 1) {
                    ret += 's';
                }
                return ret;
            }
        }
    ]
});
