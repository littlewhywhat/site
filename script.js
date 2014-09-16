var snapName = "#main";
var mainParentTag = "g";
var loadUrl = "map.svg";
var s = Snap(snapName);
Snap.load(loadUrl, function(f) {
	
	g = f.select(mainParentTag);
	
	s.append(g);
	
	
	attachHandlers(g.selectAll('.content'))
});

function attachHandlers(elements) {

	elements.forEach(function(element) {
		opacity(element, 0.25, 400);
		element.hover(function() {
			opacity(element, 2.0, 600);
		}, function() {
			opacity(element, 0.25, 600);
		});
	});
}

function Element(element) {
	this.svgEl = element;
	this.hover = function(fin, fout) {
		element.hover(fin, fout);
	}
}

function opacity(element, opacity, duration) {
	element.animate({'opacity': opacity}, duration)
}

function scale(element, scale, duration) {
		var bbox = element.getBBox();
		var translateX = (1 - scale) * bbox.cx;
		var translateY = (1 - scale) * bbox.cy;
		element.animate({transform : "scale("+ scale +") " +
				"translate( " + translateX + ", " + translateY + ")" }, duration);
}