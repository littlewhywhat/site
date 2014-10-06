// Copyright 2014 Roman Vayvod

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


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
	var eventsTracker = new EventsTracker($footer, 
		['mousedown'], 
		['mouseup', 'mouseout']);
	var initBottom = parseInt($element.css('bottom'));

	function reduceBottomOn(change) {
		setBottom(initBottom - change);
	}

	function recoverBottom() {
		setBottom(initBottom);
	}

	function setBottom(value) {
		$element.css('bottom', value + '%');
	}

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
	function close() {
		instance.animHide();
		site.unfocus();
	}

	this.isReady = function() {
		return !$element.is(':animated');
	}
	this.animShow = function() {
		if (!isOpened() && instance.isReady())
			$element.slideToggle(ANIM_DURATION);
	}
	this.animHide = function() {
		if (isOpened() && instance.isReady())
			$element.slideToggle(ANIM_DURATION);
	}
	this.setLayer = function(layer) {
		setColor(layer.color);
		setBorderColor(layer.borderColor);
		loadDescription(layer.name);
	}
	
	eventsTracker.onStart(function(event) {		
		var startValue = event.pageY;
		eventsTracker.on('mousemove', function(event) {
			var change = event.pageY - startValue;
			if (change > 0)
				if (change <= 10) {
					reduceBottomOn(change/5);
				}
				else {
					eventsTracker.stop();
					close();
				}	
		})
	});
	eventsTracker.onStop(function() {
		recoverBottom();
	});

	$footer.on('swipeleft', function() {
		close();
	});
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
	var cache = new Array();
	var FOLDER = 'layers/';
	this.get = function(name) {
		return cache[name];
	}
	this.load = function() {
		FILENAMES.forEach(function(filename) {
			$.ajax({
				type: 'GET',
				url: FOLDER + filename + html,
				success: function(data) {
					cache[filename] = data;
				}
			});
		});
		
	}
}