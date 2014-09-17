var snapName = "#main";
var mainParentTag = "g";
var loadUrl = "map.svg";
var s = Snap(snapName);
var mainParent,
	scalePositionX,
	scalePositionY;
Snap.load(loadUrl, function(f) {	
	mainParent = f.select(mainParentTag);

	s.append(mainParent);

	setViewBoxBy(mainParent);
	setScalePosition(mainParent);
	attachHandlers(mainParent.selectAll('.content'))
});

function setViewBoxBy(element) {
	var bbox = mainParent.getBBox();
	var svg = document.getElementById('main');
	svg.setAttribute('viewBox', '0 0 ' 
		+ bbox.w + ' ' 
		+ bbox.h + ' ');
}

function setScalePosition(mainParent) {
	var bbox = mainParent.getBBox();
	scalePositionX = bbox.w / 4;
	scalePositionY = bbox.h / 2;
}

function attachHandlers(elements) {
	elements.forEach(function(element) {
		element.click( function() {
			animScale(element, 1.2, 1000);
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
	var translateX =  (scalePositionX - x);
	var translateY =  (scalePositionY - y);
	var matrix = new Snap.Matrix();
	matrix.translate(translateX, translateY);
	matrix.scale(scale, scale, x, y);
	mainParent.animate({
		transform: matrix.toTransformString()
	}, duration, mina.bounce);
}