/*!
 * Sequence.js
 * http://www.github.com/juancamiloestela/Sequence.js
 * MIT licensed
 * Version 0.1
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


