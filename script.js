var s = Snap("#main");
Snap.load("main.svg", function(f) {
	g = f.select("g");
	f.selectAll("text").attr({visibility : 'hidden'});
	s.append(g);
	
	var circles = s.selectAll("ellipse");
	//circles.attr({'pointer-events':'auto'});
	circles.forEach(function(circle) {		
		circle.hover(
			function() {
				circle.attr({fill : 'violet'});
			},
			function() {
				circle.attr({fill : 'white'});
			});
	},
	circles);

});







