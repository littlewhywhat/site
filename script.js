var s = Snap("#main");
Snap.load("main.svg", function(f) {
	g = f.select("g");
	f.selectAll("text").attr({visibility : 'hidden'});
	s.append(g);
	$("circle").hover(function() {
		$(this).closest("text").toggle();
	});
});





