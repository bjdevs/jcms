var map = new AMap.Map('map_container', {
    zoom: 8,
    center: [115.84415,30.227124]
});
AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
    new SimpleMarker({
        iconLabel: 'H',
        iconStyle: {
            src: 'static/lzs/images/mark_b.png',
            style: {
                width: '20px',
                height: '30px'
            }
        },
        //设置基点偏移
        offset: new AMap.Pixel(-10, -30),

        map: map,
        showPositionPoint: true,
        zIndex: 200
    });

});