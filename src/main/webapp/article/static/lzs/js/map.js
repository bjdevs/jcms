/*
var map = new AMap.Map('map_container', {
    zoom: 8,
    center: [115.84415,30.227124]
});
AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
    new SimpleMarker({
        iconLabel: 'H',
        iconStyle: {
            src: 'http://images.hmlzs.cn/pic/2017-06-28_1414234022.png',
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

});*/
var map = new AMap.Map('map_container', {
    zoom: 8,
    center: [115.84415,30.227124]
});
var marker = new AMap.Marker({
    map:map,
    position:[115.84415,30.227124]
});
/*marker.setLabel({
    offset: new AMap.Pixel(-20, 33),//修改label相对于maker的位置
    content: "查看路线"
});*/
marker.on('click',function(e){
    marker.markOnAMAP({
        name:'黄梅老祖寺',
        position:marker.getPosition()
    })
});

// map.addControl(new AMap.ToolBar());
if(AMap.UA.mobile){
    document.getElementById('button_group').style.display='none';
}