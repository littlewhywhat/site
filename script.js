

var s = Snap("#scheme");
var circle = s.circle(500,500,100);
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
	circle.animate({r: 110}, 10, function() {
		circle.animate({r: 100}, duration)
	});
});
Snap.load("http://test-littlewhywhat.rhcloud.com/site/mobile_cloud_services.svg", function(f) {
	g = f.select("g");
	s.append(g);
});



