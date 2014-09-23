// Copyright 2014 Roman Vayvod

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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