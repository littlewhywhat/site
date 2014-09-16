var s = Snap("#main");
Snap.load("main.svg", function(f) {
	g = f.select("g");
	
	s.append(g);
	
	var gElement = new Element(g);
	gElement.hover(
		function() {
			gElement.scale(1.2, 400);
		},
		function() {
			gElement.scale(1.0, 400);
		});

	var circles = s.selectAll(".circle");
	circles.forEach(function(circle) {	
		var ellipse = circle.select("ellipse");	
		var text = circle.select("text");
		ellipse.hover(
			function() {
				ellipse.attr({fill : 'violet'});
				//ellipse.attr({rx : 50});
				//ellipse.attr({ry : 50});
				text.attr({visibility : 'visible'});
			},
			function() {
				ellipse.attr({fill : 'white'});
				//ellipse.attr({rx : 40});
				//ellipse.attr({ry : 40});
				text.attr({visibility : 'hidden'});
		});
	},
	circles);

});

function Element(element) {
	this.svgEl = element;
	this.bbox = this.svgEl.getBBox();
	this.scale = function (scale, duration) {
		var translateX = (1 - scale) * this.bbox.cx;
		var translateY = (1 - scale) * this.bbox.cy;
		element.animate({transform : "scale("+ scale +") " +
				"translate( " + translateX + ", " + translateY + ")" }, duration)
	}
	this.hover = function(fin, fout) {
		element.hover(fin, fout);
	}
}
