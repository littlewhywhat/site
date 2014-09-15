var s = Snap("#main");
Snap.load("main.svg", function(f) {
	g = f.select("g");
	s.append(g);
	
	var circles = s.selectAll(".circle");
	circles.forEach(function(circle) {	
		var ellipse = circle.select("ellipse");	
		var text = circle.select("text");
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
	circles);

});







