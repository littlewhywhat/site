$(document).ready(new Main().main);

function Main() {
	this.main = function() {
		var svgId = "main";
		var mapSelector = "g";
		var mapUrl = "map.svg";
		var site = new Site();
		site.init(svgId, mapUrl, mapSelector);
	}
}

function Site() {
	var instance = this;
	var FOCUS_SCALE = 1.2;
	var ANIM_DURATION = 1000;
	var snap;
	var svgElement;
	var xFocus;
	var yFocus;
	var snapMap;

	this.popup = new Popup(this);

	function setViewBox() {
		var height = parseInt(snapMap.attr('height'));
		var width = parseInt(snapMap.attr('width'));
		svgElement.setAttribute('viewBox', '0 0 ' 
		+ width + ' ' 
		+ height + ' ');
	}
	function setFocusCoords() {
		var relX = 0.375;
		var relY = 0.5;
		var height = parseInt(snapMap.attr('height'));
		var width = parseInt(snapMap.attr('width'));
		xFocus = width * relX;
		yFocus = height * relY;
	}
	function createLayers() {
		var snapElements = snapMap.selectAll('.content');
		snapElements.forEach(function(snapElement) {
			var layer = new Layer(instance, snapElement);
			layer.unfocus();
		});
	}
	function animTransform(matrix) {
		snapMap.animate({
			transform: matrix.toTransformString()
		}, ANIM_DURATION, mina.bounce);
	}
	this.focus = function(x,y) {
		var translateX =  (xFocus - x);
		var translateY =  (yFocus - y);
		var matrix = new Snap.Matrix();
		matrix.translate(translateX, translateY);
		matrix.scale(FOCUS_SCALE, FOCUS_SCALE, x, y);
		animTransform(matrix);
	}
	this.unfocus = function() {
		var matrix = new Snap.Matrix();
		animTransform(matrix);
	}
	this.init = function(svgId, mapUrl, mapSelector) {
		svgElement = document.getElementById(svgId);
		snap = Snap(svgElement);
		Snap.load(mapUrl, function(data) {	
			snapMap = data.select(mapSelector);
			snap.append(snapMap);

			setViewBox();
			setFocusCoords();

			createLayers();
		});
	}
	
}

function Popup(site) {
	var instance = this;
	var ANIM_DURATION = 1000;
	var $element = $('#popup');
	
	var isOpened = function() {
		return $element.is(':visible');
	}

	this.animShow = function() {
		if (!isOpened())
			$element.slideToggle(ANIM_DURATION);
	}
	this.animHide = function() {
		if (isOpened())
			$element.slideToggle(ANIM_DURATION);
	}

	$element.click(function() {
		instance.animHide();
		site.unfocus();
	});
}

function Layer(site, snapElement) {
	var instance = this;
	var ANIM_DURATION = 1000;
	var FOCUS_OPACITY = 2.0;
	var UNFOCUS_OPACITY = 0.25;
	var cx;
	var cy;
	var setCenter = function() {
		var bbox = snapElement.getBBox();
		cx = bbox.cx;
		cy = bbox.cy;
	}
	var animOpacity = function(opacity) {
		snapElement.animate({'opacity': opacity}, ANIM_DURATION);
	}
	
	setCenter(snapElement);

	this.focus = function() {
		animOpacity(FOCUS_OPACITY);
	}
	this.unfocus = function() {
		animOpacity(UNFOCUS_OPACITY);
	}

	snapElement.click(function(){
		site.focus(cx,cy);
		site.popup.animShow();
	});
	
	snapElement.hover(function(){
			instance.focus();
		}, function() {
			instance.unfocus();
	});
}