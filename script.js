var snapName = "#main";
var mainParentTag = "g";
var loadUrl = "main.svg";
var s = Snap(snapName);
Snap.load(loadUrl, function(f) {
	
	g = f.select(mainParentTag);
	s.append(g);

	var gElement = new Element(g);
	gElement.hover(
		function() {
			gElement.scale(1.2, 400);
		},
		function() {
			gElement.scale(1.0, 400);
		});
	initNodes(s);
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

function initNodes(s) {
	var nodes = s.selectAll(".node");
	nodes.forEach(function(node) {	
		var ellipse = node.select("ellipse");	
		var text = node.select("text");
		ellipse.hover(
			function() {
				ellipse.attr({fill : 'violet'});
				text.attr({visibility : 'visible'});
			},
			function() {
				ellipse.attr({fill : 'white'});
				text.attr({visibility : 'hidden'});
		});
	},
	nodes);
}