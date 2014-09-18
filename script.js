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
	var activeLayer;

	this.popup = new Popup(this);
	function setActive(layer) {
		if (activeLayer)
			activeLayer.activate();
		activeLayer = layer;
		activeLayer.unactivate();
	}
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
		});
	}
	function animTransform(matrix) {
		snapMap.animate({
			transform: matrix.toTransformString()
		}, ANIM_DURATION, mina.bounce);
	}
	function focus(x,y) {
		var translateX =  (xFocus - x);
		var translateY =  (yFocus - y);
		var matrix = new Snap.Matrix();
		matrix.translate(translateX, translateY);
		matrix.scale(FOCUS_SCALE, FOCUS_SCALE, x, y);
		animTransform(matrix);
	}
	this.focus = function(layer) {
		focus(layer.cx, layer.cy);
		setActive(layer);
		instance.popup.setColor(layer.color);
		instance.popup.loadDescription(layer.url());
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
	
	function isOpened() {
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
	this.setColor = function(color) {
		$element.css( {'background-color': color });
	}
	this.loadDescription = function(url) {
		$element.empty();
		$element.load(url);
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
	var FOLDER = 'layers/'
	var text = snapElement.select('text').attr('text');
	this.cx;
	this.cy;	
	this.color = snapElement.select('ellipse').attr('fill');

	function setCenter() {
		var bbox = snapElement.getBBox();
		instance.cx = bbox.cx;
		instance.cy = bbox.cy;
	}
	function animOpacity(opacity) {
		snapElement.animate({'opacity': opacity}, ANIM_DURATION);
	}
	
	function clickCallback(){
		site.focus(instance);
		site.popup.animShow();
	}
	function hover() {
		snapElement.hover(focus, unfocus);
	}
	function unhover() {
		snapElement.unhover(focus, unfocus);
	}
	function click() {
		snapElement.click(clickCallback);
	}
	function unclick() {
		snapElement.unclick(clickCallback);
	}

	function focus() {
		animOpacity(FOCUS_OPACITY);
	}
	function unfocus() {
		animOpacity(UNFOCUS_OPACITY);
	}
	this.activate = function() {
		unfocus();
		hover();
		click();
	}
	this.unactivate = function() {
		unhover();
		unclick();
	}
	this.url = function() {
		return FOLDER + text.toLowerCase() + ".html";
	}

	setCenter(snapElement);
	this.activate();
}
