

var s = Snap("#svg");
var circle = s.circle(10,10,15);
circle.mouseover(function() {
	circle.attr({
		fill:'#f00'
	});
});
circle.mouseout(function() {
	circle.attr({
		id: 'circle',
		fill:'#000'
	});
});
circle.drag();
circle.dblclick(function() {
	var duration = 200;
	circle.animate({r: 17}, 10, function() {
		circle.animate({r: 15}, duration)
	});
});
Snap.load("file:///C:/Users/LittleWhyWhat/Desktop/WebProject/mobile_cloud_services.svg", function(f) {
	g = f.select("g");
	s.append(g);
});



