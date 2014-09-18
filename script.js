var svgId = "main";
var rootSelector = "g";
var mapUrl = "map.svg";

var site = new Site();
site.init(svgId, mapUrl, rootSelector);

function Site() {
	var instance = this;
	var snap;
	var svg;
	
	this.popup = new Popup();
	this.root;
	this.scalePositionX;
	this.scalePositionY;

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
		instance.scalePositionX = width * percentX;
		instance.scalePositionY = height * percentY;
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
		element.slideToggle(animDuration);
	}
	this.animHide = function() {
		element.slideToggle(animDuration);
	}

	element.click(function() {
		instance.animHide();
		recoverSite();
	});
}

function attachHandlers(elements) {
	elements.forEach(function(element) {
		element.click( function() {
			animScale(element, 1.2, 1000);
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

function animScale(element, scale, duration) {
	var bbox = element.getBBox();
	var x = bbox.cx;
	var y = bbox.cy;
	var translateX =  (site.scalePositionX - x);
	var translateY =  (site.scalePositionY - y);
	var matrix = new Snap.Matrix();
	matrix.translate(translateX, translateY);
	matrix.scale(scale, scale, x, y);
	site.root.animate({
		transform: matrix.toTransformString()
	}, duration, mina.bounce);
}

function recoverSite() {
	var matrix = new Snap.Matrix();
	matrix.translate(0, 0);
	matrix.scale(1);
	site.root.animate({
		transform: matrix.toTransformString()
	}, 1000, mina.bounce);
}