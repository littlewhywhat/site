$( document ).on( "mobileinit", function() {
  $.mobile.loader.prototype.options.text = "";
});

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
	this.loadManager = new LoadManager();
	function setActive(layer) {
		if (activeLayer)
			activeLayer.activate();
		activeLayer = layer;
		activeLayer.unactivate();
		instance.popup.setLayer(layer);
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
		if (instance.popup.isReady()) {
			instance.popup.animShow();
			focus(layer.cx, layer.cy);
			if (activeLayer !== layer)
				setActive(layer);
		}
	}
	this.unfocus = function() {
		var matrix = new Snap.Matrix();
		animTransform(matrix);
		activeLayer.click();
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
		this.loadManager.load();
	}
	
}

function Popup(site) {
	var instance = this;
	var ANIM_DURATION = 1000;
	var $element = $('#popup');
	var $content = $element.find('.content');
	var $footer = $element.find('.footer');
	var changer = new Changer($element, 'bottom', '%', 5, 'mousemove');

	function isOpened() {
		return $element.is(':visible');
	}
	function setColor(color) {
		$element.css( {'background-color': color });
	}
	function setBorderColor(color) {
		$element.css( {'border-color': color });
	}
	function loadDescription(name) {
		$content.html(site.loadManager.get(name));
	}
	this.close = function() {
		instance.animHide();
		site.unfocus();
	}
	this.isReady = function() {
		return !$element.is(':animated');
	}
	this.animShow = function() {
		if (!isOpened())
			$element.slideToggle(ANIM_DURATION);
	}
	this.animHide = function() {
		if (isOpened())
			$element.slideToggle(ANIM_DURATION);
	}
	this.setLayer = function(layer) {
		setColor(layer.color);
		setBorderColor(layer.borderColor);
		loadDescription(layer.name);
	}

	$footer.mousedown(function(event) {
		var startValue = event.pageY;
		changer.handleChange( 
		function(event) {
			return event.pageY - startValue;
		}, function(change) {
			return change > 0 && change <= 10;
		}, function(change) {
			return change > 10;
		}, instance.close);
		$footer.mouseout(function(event) {
			$footer.unbind('mouseout');
			$footer.unbind('mouseup');
			changer.stop();
		});
		$footer.mouseup(function(event) {
			$footer.unbind('mouseout');
			$footer.unbind('mouseup');
			changer.stop();
		});
	});
	

	$footer.on('swipeleft', function() {
	 	instance.close();
	});
}

function Changer($element, attrName, measure, speed, eventName) {
	var instance = this;
	var initValue = $element.css(attrName);
	function changeElement(change) {		
		$element.css(attrName, (parseInt(initValue) - change/speed) + measure);		
	}
	function recoverElement() {
		$element.css(attrName, initValue);
	}
	this.handleChange = function(getChange, changeCondition, stopCondition, stopCallback) {
		
		$element.bind(eventName, function(event) {
			var change = getChange(event);
			if (changeCondition(change))
				changeElement(change);
			else if (stopCondition(change)) {
				instance.stop();
				stopCallback();
			}
		});
	}

	this.stop = function() {
		$element.unbind(eventName);
		recoverElement();
	}
}	


function Layer(site, snapElement) {
	var instance = this;
	var ANIM_DURATION = 1000;
	var FOCUS_OPACITY = 2.0;
	var UNFOCUS_OPACITY = 0.25;
	this.name = snapElement.select('text').attr('text').toLowerCase();
	this.cx;
	this.cy;	
	this.color = snapElement.select('ellipse').attr('fill');
	this.borderColor = snapElement.select('ellipse').attr('stroke');

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
	}
	function hover() {
		snapElement.hover(focus, unfocus);
	}
	function unhover() {
		snapElement.unhover(focus, unfocus);
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
	this.click = function() {
		snapElement.click(clickCallback);
	}
	this.activate = function() {
		unfocus();
		hover();
		this.click();
	}
	this.unactivate = function() {
		unhover();
		unclick();
	}

	setCenter(snapElement);
	this.activate();
}

function LoadManager() {
	var html = ".html"
	var FILENAMES = ['me', 'sport', 'education', 'experience',
				 		'interests', 'job', 'music', 'online', 
				 		'projects', 'university'];
	var cash = new Array();
	var FOLDER = 'layers/';
	this.get = function(name) {
		return cash[name];
	}
	this.load = function() {
		FILENAMES.forEach(function(filename) {
			$.ajax({
				type: 'GET',
				url: FOLDER + filename + html,
				success: function(data) {
					cash[filename] = data;
				}
			});
		});
		
	}
}