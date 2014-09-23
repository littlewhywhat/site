function EventsTracker($element, startEvents, stopEvents) {
	var instance = this;
	var stopEvents = stopEvents;
	var startEvents = startEvents;
	var callbackEvents = [];
	var onStopCallback;
	var onStartCallback;

	function bindMouseUpOut() {
		stopEvents.forEach(function(stopEvent) {
			$element.on(stopEvent, function() {
				instance.stop();
			});
		})
	}
	function init() {
		startEvents.forEach(function(startEvent) {
			$element.on(startEvent, function(event) {
				start(event);
			});
		});
	}
	function start(event) {
		onStartCallback(event);
		bindMouseUpOut();
	}
	function unbindCallbackEvents() {
		callbackEvents.forEach(function(event) {
			$element.unbind(event);
		})
	}
	function unbindStopEvents() {
		stopEvents.forEach(function(stopEvent) {
			$element.unbind(stopEvent);
		})
	}
	
	this.on = function(eventName, callback) {
		callbackEvents.push(eventName);
		$element.on(eventName, callback);
	}
	this.onStart = function(callback) {
		onStartCallback = callback;
	}
	this.onStop = function(callback) {
		onStopCallback = callback;
	}

	this.stop = function() {		
		unbindCallbackEvents();
		unbindStopEvents();	
		callbackEvents = [];
		if (onStopCallback)
			onStopCallback();
	}

	init();
}