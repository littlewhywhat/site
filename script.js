var s = Snap("#main");
Snap.load("main.svg", function(f) {
	g = f.select("g");
	f.selectAll("text").attr({visibility : hidden});
	f.selectAll("circle").drag();
	s.append(g);
});





