var svgId = "main";
var rootSelector = "g";
var mapUrl = "map.svg";

var site = new Site();
site.init(svgId, mapUrl, rootSelector);

function Site() {
	this.popup = new Popup();
	this.snap;
	this.root;
	this.svg;
	this.scalePositionX;
	this.scalePositionY;

	this.init = function(svgId, mapUrl, rootSelector) {
		this.svg = document.getElementById(svgId);
		this.snap = Snap(this.svg);
		Snap.load(mapUrl, function(data) {	
			this.root = data.select(rootSelector);
			this.snap.append(this.root);

			this.setViewBox();
			this.setScalePosition();

			attachHandlers(this.root.selectAll('.content'));
		}, this);
	}
	this.setViewBox = function() {
		var bbox = this.root.getBBox();
		this.svg.setAttribute('viewBox', '0 0 ' 
		+ bbox.w + ' ' 
		+ bbox.h + ' ');
	}
	this.setScalePosition = function() {
		var percentX = 0.375;
		var percentY = 0.5;
		var bbox = this.root.getBBox();
		this.scalePositionX = bbox.w * percentX;
		this.scalePositionY = bbox.h * percentY;
	}
}

function Popup() {
	var instance = this;
	var animDuration = 1000;
	var id = '#popup';
	var element = $(id);
	var way = $(document).height();
	var hide = function() {
		element.hide();
	}
	element.css({'margin-top': -way});
	
	this.animShow = function() {	
		element.show();	
		element.animate({
			top : way},
			animDuration
		);
	}
	this.animHide = function() {
		element.animate({
			top : -way },
			animDuration,
			hide
		);
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