/*! basecoat - v0.0.1 - 2015-08-31 */window.Basecoat = {
	version: "0.0.1",
};
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/*! select-js - v0.0.1 - 2015-08-31 *//*!
 * Select.js
 * http://www.github.com/juancamiloestela/select.js
 * MIT licensed
 * Version 0.0.1
 *
 * Copyright (C) 2013 Juan Camilo Estela http://www.mecannical.com
 *
 * TODO:
 * handle focus when label pointing to native select is clicked
 * handle tab indexes
 */


/*global*/


(function($) {
	'use strict';

	function Select(el, settings) {
		var $el = $(el),
			$select = $('<div class="selectjs"></div>'),
			$label = $('<div class="label"></div>');

		function onKey(e){
			if (e.keyCode === 40 || e.keyCode === 38) {
				// up or down arrows
				e.stopPropagation();

				sync();
				// ff needs this :(
				setTimeout(sync, 50);
			}
		}

		function focusedEl(){
			$select.on('keydown', onKey);
			$select.addClass('focused');
		}

		function blurredEl(){
			$select.off('keydown', onKey);
			$select.removeClass('focused');
		}

		function mouseOverEl(){
			$select.addClass('hover');
		}

		function mouseOutEl(){
			$select.removeClass('hover');
		}

		function isDisabled(){
			return $el.prop('disabled');
		}

		function elChanged(e){
			sync();
		}

		function sync(){
			if (isDisabled()){
				disable();
			}else{
				enable();
			}
			$label.html($el.find(':selected').html());
		}

		function refresh(){
			sync();
		}

		function disable(){
			$select.addClass('disabled');
		}

		function enable(){
			$select.removeClass('disabled');
		}

		function build(){

			$select.css({
				'position': 'relative'
			}).addClass($el.attr('class'));

			$select.append($label).insertBefore($el);

			// hide DOM select inside
			$select.append($el.remove().css({
				'top': '0',
				'left': '0',
				'width': '100%',
				'position': 'absolute',
				'opacity': '0',
				'height': '100%',
				'appearance': 'none',
				'z-index': '5'
			}));

			$el.on('focus', {}, focusedEl)
				.on('blur', {}, blurredEl)
				.on('mouseover', {}, mouseOverEl)
				.on('mouseout', {}, mouseOutEl)
				.on('change', {}, elChanged);

			refresh();
		}

		(function init(){
			if (!$el.parent().hasClass('selectjs')){
				build();
			}
		})();

	}

	// Make it a jQuery plugin
	$.fn.select = function(options) {
		var defaults = {

			},
			settings = $.extend({}, defaults, options);

		return this.each(function() {
			new Select(this, settings);
		});
	};

	// automatically handle all selects that don't have .native class
	// and are not multiple select
	$('select').not('.native').not('[multiple]').select();

	// expose to the world
	window.Selectjs = Select;
	
	/**
	 * Usage
	 *
	 * var mySelect = new Selectjs(document.getElementById('mySelect'), {})
	 */

})(jQuery);



/*! checkbox-js - v0.0.1 - 2015-08-17 *//*!
 * Checkbox.js
 * http://www.github.com/juancamiloestela/checkbox.js
 * MIT licensed
 * Version 0.0.1
 *
 * Copyright (C) 2013 Juan Camilo Estela http://www.mecannical.com
 *
 * TODO:
 */


/*global*/


(function($) {
	'use strict';

	function Checkbox(el, settings) {
		var $el = $(el),
			type = $el.prop('type'),
			$checkbox = $('<div class="checkboxjs '+type+'"></div>'),
			$indicator = $('<div class="indicator"></div>'),
			CLICK = ("ontouchstart" in window) ? 'touchstart' : 'click';

		function onKey(e){
			if (e.keyCode === 13 || e.keyCode === 32) {
				// enter or spacebar
				e.preventDefault();
				e.stopPropagation();

				toggleCheckbox();
			}
		}

		function toggleCheckbox(){
			if (!isDisabled()){
				if (type === 'radio'){
					if (!isChecked()){
						$el.prop('checked', true);
					}
				}else{
					if (isChecked()){
						$el.prop('checked', false);
					}else{
						$el.prop('checked', true);
					}
				}
				sync();
			}
		}

		function focusedCheckbox(){
			$checkbox.on('keydown', onKey);
		}

		function blurredCheckbox(){
			$checkbox.off('keydown', onKey);
		}

		function isChecked(){
			return $el.is(':checked');
		}

		function isDisabled(){
			return $el.prop('disabled');
		}

		function elChanged(e){
			sync();
		}

		function clearRadioSet(){
			if (type === 'radio'){
				$('input[name="'+$el.prop('name')+'"]').closest('.checkboxjs').removeClass('checked');
			}
		}

		function sync(){
			if (isChecked()){
				clearRadioSet();
			}

			if (isChecked()){
				check();
			}else{
				uncheck();
			}

			if (isDisabled()){
				disable();
			}else{
				enable();
			}
		}

		function refresh(){
			sync();
		}

		function check(){
			$checkbox.addClass('checked');
		}

		function uncheck(){
			$checkbox.removeClass('checked');
		}

		function disable(){
			$checkbox.addClass('disabled');
		}

		function enable(){
			$checkbox.removeClass('disabled');
		}

		function build(){

			$checkbox.css({
				'position': 'relative'
			}).prop({
				'tabindex': $el.prop('tabindex')
			}).addClass($el.attr('class'));
			$checkbox.attr('tabindex', 0);

			$checkbox.append($indicator).insertBefore($el);

			// hide DOM checkbox inside
			$checkbox.append($el.remove().css({
				'top': '0',
				'width': '100%',
				'height': '100%',
				'position': 'absolute',
				'opacity': '0.0'
			}).prop({
				'tabindex': '-1'
			}));
			
			$checkbox.on('focus', {}, focusedCheckbox)
					.on('blur', {}, blurredCheckbox)
					.on('change', {}, elChanged);

			refresh();
		}

		(function init(){
			if (!$el.parent().hasClass('checkboxjs')){
				build();
			}
		})();

	}

	// Make it a jQuery plugin
	$.fn.checkbox = function(options) {
		var defaults = {
				
			},
			settings = $.extend({}, defaults, options);

		return this.each(function() {
			new Checkbox(this, settings);
		});
	};

	// automatically handle all checkboxes and radio buttons that don't have .native class
	$('input[type="checkbox"], input[type="radio"]').not('.native').checkbox();

	// expose to the world
	window.Checkboxjs = Checkbox;
	
	/**
	 * Usage
	 *
	 * var myCheckbox = new Checkboxjs(document.getElementById('myCheckbox'), {})
	 */


})(jQuery);



/*! dismissable-js - v0.0.1 - 2015-08-17 */(function($){
	'use strict';

	function dismiss(e){
		e.preventDefault();
		e.stopPropagation();

		var $this = $(e.currentTarget);

		$this.closest('.dismissable').fadeOut(function(){
			$this.remove();
		});
	}

	$( document ).on('click', '.dismissable .dismiss', dismiss);

})(jQuery);
/*! sequence-js - v0.0.1 - 2015-08-17 *//*!
 * Sequence.js
 * http://www.github.com/juancamiloestela/Sequence.js
 * MIT licensed
 * Version 0.0.1
 *
 * Copyright (C) 2013 Juan Camilo Estela http://www.mecannical.com
 *
 * This class adds and/or removes classes or styles from a set of elements in sequential order.
 */


/*global*/


(function($) {
'use strict';

	function Sequence(elements, config) {
		var settings = {
				offset: config.offset || 500,
				setup: config.setup || false,
				done: config.done || false,
				add: config.add || false,
				remove: config.remove || false,
				properties: config.properties || false
			},
			self,
			current = 0,
			timeout;

		function setup(callback){
			settings.setup = callback;
			return self;
		}

		function done(callback){
			settings.done = callback;
			return self;
		}

		function offset(value){
			if (value){
				settings.offset = value;
				return self;
			}
			return settings.offset;
		}

		function add(classes){
			if (classes){
				settings.add = classes;
				return self;
			}
			return settings.add;
		}

		function remove(classes){
			if (classes){
				settings.remove = classes;
				return self;
			}
			return settings.remove;
		}

		function play(){
			current = 0;
			if (typeof settings.setup === 'function'){
				// TODO: automatically remove transition and set back after setup? 
				// what if elements have different transitions?
				settings.setup(elements);
			}
			step();
			// allow chaining
			return self;
		}

		function stop(){
			clearTimeout(timeout);
			return self;
		}

		function step(){
			var i;
			if (settings.remove){
				var classes = settings.remove.split(' ');
				for (i in classes){
					elements[current].className = elements[current].className.replace(new RegExp('(\\s|^)'+classes[i]+'(\\s|$)'), ' ');
				}
			}

			if (settings.add){
				elements[current].className += ' ' + settings.add;
			}

			if (settings.properties){
				if ($){
					$(elements[current]).css(settings.properties);
				}else{
					for (i in settings.properties){
						if (settings.properties.hasOwnProperty(i)){
							elements[current].style[i] = settings.properties[i];
						}
					}
				}
			}

			current++;
			if (elements[current]){
				setTimeout(step, settings.offset);
			}else{
				if (typeof settings.done === 'function'){
					settings.done(elements);
				}
			}
		}

		// TODO: pause, next, prev

		(function init(){
			// if elements is a css query
			if (typeof elements === 'string'){
				// grab them
				elements = document.querySelectorAll(elements);
			}
		})();

		self = {
			setup: setup,
			done: done,
			offset: offset,
			add: add,
			remove: remove,
			play: play,
			stop: stop
		};

		return self;
	}

	if ($ && $.fn){
		// Make it a jQuery plugin
		$.fn.sequence = function(options) {
			var defaults = {},
				settings = $.extend({}, defaults, options);

			new Sequencejs(this, settings).play();
			return this;
		};
	}

	// expose to the world
	window.Sequencejs = Sequence;
	
	/**
	 * Usage
	 *
	 * $('.side-nav a').sequence({
	 * 		setup: function(){
	 * 			console.log('setup!');
	 * 		},
	 * 		offset: 500,
	 * 		add: 'in',
	 * 		remove: 'out',
	 * 		done: function(){
	 * 			console.log('done!');
	 * 		}
	 * });
	 *
	 * Or
	 * 
	 * var sequence = new Sequencejs('.side-nav a', {
	 * 		setup: function(){
	 * 			console.log('setup!');
	 * 		},
	 * 		offset: 1000,
	 * 		add: 'in',
	 * 		remove: 'out',
	 * 		done: function(){
	 * 			console.log('done!');
	 * 		}
	 * 	}).play();
	 * 
	 */

	


})(jQuery);



/*! broken-js - v0.0.2 - 2015-08-17 *//*!
 * Broken.js
 * http://www.github.com/juancamiloestela/select.js
 * MIT licensed
 * Version 0.0.2
 *
 * Copyright (C) 2013 Juan Camilo Estela http://www.mecannical.com
 *
 * TODO:
 * Allow replacing with custom content
 */


/*global*/


(function($) {
	'use strict';

	var canvas = document.createElement("canvas"),
		ctx;

	if (!canvas.getContext){
		console.warn('Broken.js aborted, canvas is not supported on this browser');
		return;
	}

	ctx = canvas.getContext("2d");

	function handleBrokenImage(e){
		var $this = $(e.currentTarget);

		if (!$this.hasClass('broken')){
			$this.addClass('broken');

			var image = new Image();
			image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAAEECAYAAADOCEoKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODBCMzNBQzg0MTRCMTFFNDg0NzdCNjY1MDZDRjNGQjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODBCMzNBQzk0MTRCMTFFNDg0NzdCNjY1MDZDRjNGQjgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MEIzM0FDNjQxNEIxMUU0ODQ3N0I2NjUwNkNGM0ZCOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MEIzM0FDNzQxNEIxMUU0ODQ3N0I2NjUwNkNGM0ZCOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoQtWuQAAAsdSURBVHja7N0NpN7X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";
			image.onload = function() {
				canvas.width = parseInt($this.attr('width'), 10) || image.width;
				canvas.height = parseInt($this.attr('height'), 10) || (canvas.width/image.width * image.height);
				ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
				ctx.font = "bold 12px sans-serif";
				ctx.fillStyle = "#848484";
				ctx.textAlign = 'center';
				ctx.fillText($this.attr('src'), canvas.width/2, canvas.height - 15);
				$this.attr('src', canvas.toDataURL());
			};
		}
	}

	$(function(){
		$('img').each(function(i, img){
			var $img = $(img);
			$img.one('error', handleBrokenImage);
			$img.attr('src', $img.attr('src'));
		});
	});

})(jQuery);