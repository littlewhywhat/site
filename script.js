var s = Snap("#main");
Snap.load("main.svg", function(f) {
	g = f.select("g");
	
	s.append(g);
	var cx = g.getBBox().cx;
	var cy = g.getBBox().cy;
	g.hover(
		function() {
			g.animate({transform : "scale(1.2) " +
				"translate( -"+cx*0.2 +", -"+cy*0.2 +")" }, 400);
		},
		function() {
			g.animate({transform : "scale(1.0) translate(0.5, 0.5)" }, 400)
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
