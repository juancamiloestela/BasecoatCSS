/*global*/

(function($){
'use strict';

	window.Device = (function(){

		var device = {
			touchable: ('touchstart' in window),
			events: {
				START: 'mousedown',
				CLICK: 'click',
				MOVE: 'mousemove',
				END: 'mouseup'
			}
		};

		(function init(){
			device.events = device.touchable ? {
													START: 'touchstart',
													CLICK: 'touchstart',
													MOVE: 'touchmove',
													END: 'touchend'
												} :
												{
													START: 'mousedown',
													CLICK: 'click',
													MOVE: 'mousemove',
													END: 'mouseup'
												};
		})();

		return device;

	})();

}(jQuery || $));