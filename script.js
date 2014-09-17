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
	
	recordScalePosition(mainParent);
	attachHandlers(mainParent.selectAll('.content'))
});

function recordScalePosition(mainParent) {
	var bbox = mainParent.getBBox();
	scalePositionX = bbox.w / 4;
	scalePositionY = bbox.h / 2;
}

function attachHandlers(elements) {
	elements.forEach(function(element) {
		element.click( function() {
			scale(element, 1.2, 1000);
		}, element);
		opacity(element, 0.25, 400);
		element.hover(function() {
			opacity(element, 2.0, 600);
		}, function() {
			opacity(element, 0.25, 600);
		});
	});
}

function opacity(element, opacity, duration) {
	element.animate({'opacity': opacity}, duration)
}

function scale(element, scale, duration) {
	var bbox = element.getBBox();
	var x = bbox.cx;
	var y = bbox.cy;
	var translateX =  (scalePositionX - x);
	var translateY =  (scalePositionY - y);
	var matrix = new Snap.Matrix();
	matrix.translate(translateX, translateY);
	mainParent.animate({
		transform: matrix.toTransformString()
	}, duration, mina.bounce);
}