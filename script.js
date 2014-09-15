var s = Snap("#main");
Snap.load("main.svg", function(f) {
	g = f.select("g");
	f.selectAll("text").attr({visibility : 'hidden'});
	f.selectAll("circle").hover(
		function() {
			$(this).closest("text").toggle();
		},
		function() {
			$(this).closest("text").toggle();
		});
	s.append(g);
	
});





