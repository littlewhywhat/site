var svgId = "main";
var rootSelector = "g";
var mapUrl = "map.svg";

var site = new Site();
site.init(svgId, mapUrl, rootSelector);

function Site() {
	var instance = this;
	var snap;
	var svg;
	var scaleFocus = 1.2;
	var focusDuration = 1000;
	var scalePositionX;
	var scalePositionY;

	this.popup = new Popup();
	this.root;

	function setViewBox() {
		var height = parseInt(instance.root.attr('height'));
		var width = parseInt(instance.root.attr('width'));
		svg.setAttribute('viewBox', '0 0 ' 
		+ width + ' ' 
		+ height + ' ');
	}
	function setScalePosition() {
		var percentX = 0.375;
		var percentY = 0.5;
		var height = parseInt(instance.root.attr('height'));
		var width = parseInt(instance.root.attr('width'));
		scalePositionX = width * percentX;
		scalePositionY = height * percentY;
	}
	this.focus = function(x,y) {
		var translateX =  (scalePositionX - x);
		var translateY =  (scalePositionY - y);
		var matrix = new Snap.Matrix();
		matrix.translate(translateX, translateY);
		matrix.scale(scaleFocus, scaleFocus, x, y);
		instance.root.animate({
			transform: matrix.toTransformString()
		}, focusDuration, mina.bounce);
	}
	this.unfocus = function() {
		var matrix = new Snap.Matrix();
		instance.root.animate({
			transform: matrix.toTransformString()
		}, focusDuration, mina.bounce);
	}
	this.init = function(svgId, mapUrl, rootSelector) {
		svg = document.getElementById(svgId);
		snap = Snap(svg);
		Snap.load(mapUrl, function(data) {	
			this.root = data.select(rootSelector);
			snap.append(this.root);

			setViewBox();
			setScalePosition();

			attachHandlers(this.root.selectAll('.content'));
		}, this);
	}
	
}

function Popup() {
	var instance = this;
	var animDuration = 1000;
	var id = '#popup';
	var element = $(id);
	
	this.animShow = function() {
		if (!element.is(':visible'))
			element.slideToggle(animDuration);
	}
	this.animHide = function() {
		if (element.is(':visible'))
			element.slideToggle(animDuration);
	}

	element.click(function() {
		instance.animHide();
		site.unfocus();
	});
}

function attachHandlers(elements) {
	elements.forEach(function(element) {
		element.click( function() {
			var bbox = element.getBBox();
			var x = bbox.cx;
			var y = bbox.cy;
			site.focus(x,y);
			site.popup.animShow();
		}, element);
		animOpacity(element, 0.25, 400);
		element.hover(function() {
			animOpacity(element, 2.0, 600);
		}, function() {
			animOpacity(element, 0.25, 600);
		});
	});
}

function animOpacity(element, opacity, duration) {
	element.animate({'opacity': opacity}, duration)
}