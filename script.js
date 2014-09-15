var s = Snap("#main");
Snap.load("main.svg", function(f) {
	g = f.select("g");
	f.selectAll("text").attr({visibility : 'hidden'});
	f.selectAll("circle");
	f.selectAll("circle").foreach(function(element) {
		element.hover(
		function() {
			$(this).closest("text").toggle();
		},
		function() {
			$(this).closest("text").toggle();
		});
	});
	s.append(g);
	
});





