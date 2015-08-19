/**
 * [高德地图api封装]
 * @param {[type]} container（容器id，字符串）
 * @param {[type]} current_point [地图中心位置]
 */
function Map(container, current_point){
	var point;
	try {
		point = new AMap.LngLat(current_point.lng, current_point.lat);
	} catch(e){
		console.log(e);
	}
	
	// 初始化地图
	this.map = new AMap.Map(container, {
		resizeEnable: true, 
		view:new AMap.View2D({
			zoom: 9,
			center: point || null
		})
	});
	this.infoWindow = [];

	//地图中添加地图操作ToolBar插件
	this.map.plugin(["AMap.ToolBar"], function(){		
		var toolBar = new AMap.ToolBar(); 
		this.map.addControl(toolBar);		
	});
}

// 暴露地图对象
Map.prototype.getMap = function(){
	return this.map;
}

/**
 * [设置marker以及图标]
 * @param  {point,img,size,offset} option [description]
 * @return marker [返回一个marker对象]
 */
Map.prototype.createMarker = function(_option){
	if(!_option.point){
		console.log('创建标注时，未添加point！');
		return
	};
	var option = {
		point: _option.point,
		img: _option.img || __inline('/order/static/image/trace/marker-crab.png'),
		offset: _option.offset || {},
		size: _option.size || {}
	}
	var offset = {
		left: option.offset.left || 0,
		top: option.offset.top || 0
	};
	var size = {
		width: option.size.width || 35,
		height: option.size.height || 29
	}
	var point = new AMap.LngLat(option.point.lng, option.point.lat);

	var marker = new AMap.Marker({
		icon: new AMap.Icon({    
			//图标大小
			size: new AMap.Size(size.width, size.height),
			//大图地址
			image: option.img
		}),
		position: point,
		offset: new AMap.Pixel(offset.left, offset.top) //相对于基点的偏移位置
	});

	marker.setMap(this.map);
	return marker;
}


/**
 * [自定义marker]
 * @param  {point,html,offset} option [description]
 * @return marker [返回一个marker对象]
 */
Map.prototype.createBespokeMarker = function(_option){
	if(!_option.point){
		console.log('创建信息窗口时，未添加point！');
		return
	};
	var option = {
		point: _option.point,
		html: _option.html || '',
		offset: _option.offset || {}
	}
	var offset = {
		left: option.offset.left || 0,
		top: option.offset.top || 0
	};
	var point = new AMap.LngLat(option.point.lng, option.point.lat);

	var marker = new AMap.Marker({
		map:this.map,
		position: point, //基点位置
		offset: new AMap.Pixel(offset.left, offset.top), //相对于基点的偏移位置
		draggable: false,  //是否可拖动
		content: option.html   //自定义点标记覆盖物内容
	});

	marker.setMap(this.map);
	return marker;
}

/**
 * [创建自定义信息窗口]
 * @param  {html,point,onOpenning, offset} option [description]
 * @return infoWindow [返回一个infoWindow对象]
 */
Map.prototype.createInfoWindow = function(_option){
	if(!_option.point){
		console.log('创建信息窗口时，未添加point！');
		return
	};
	var option = {
		point: _option.point,
		html: _option.html || '',
		offset: _option.offset || {},
		onOpenning: _option.onOpenning || true
	}
	var offset = {
		left: option.offset.left || 0,
		top: option.offset.top || 0
	};
	var point = new AMap.LngLat(option.point.lng, option.point.lat);

	var infoWindow = new AMap.InfoWindow({
		isCustom: true,  //使用自定义窗体
		content: option.html,
		offset: new AMap.Pixel(offset.left, offset.top),
		showShadow: true //显示阴影
	});
	if(option.onOpenning){
		infoWindow.open(this.map, point);
	}

	return infoWindow;
}