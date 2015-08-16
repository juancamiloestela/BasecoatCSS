/*!
 * Elevator.js
 * http://www.github.com/juancamiloestela/Elevator.js
 * MIT licensed
 * Version 0.1
 *
 * Copyright (C) 2013 Juan Camilo Estela http://www.mecannical.com
 *
 */

(function($) {
'user strict';


	function Floor(options){
		var f = options,
			totalTops = 0,
			used = false,
			top = [0],
			globalOffset = f.scrollable.offset().top,
			debugFloors;

		function run(i, dir){
			if (f.once && used){
				return;
			}
			used = true;
			f.callback( ((f.element) ? f.element[i] : top[i].top) , dir);
		}

		function execute(prev, next){
			var dir = (prev < next) ? 'down' : 'up';
			if (f.dir == dir || f.dir == 'both'){
				for (i = 0; i < totalTops; i++){
					var offset = ((typeof f.offset === 'function') ? f.offset(dir) : f.offset);

					if (dir === 'down' && prev < top[i] + offset && top[i] + offset <= next){
						run(i, dir);
					}else if (dir === 'up' && prev > top[i] + offset && top[i] + offset >= next){
						run(i, dir);
					}
				}
			}
		}

		function refresh(){
			var t = [];
			$.each(f.element, function(i, el){
				t.push( $(el).offset().top - globalOffset);
			});
			if (t.length === 0 && f.offset !== 0){
				t.push(0);
			}
			totalTops = t.length;
			top = t;
			drawFloors();
		}

		function drawFloors(){
			var i, topWithOffset;

			if (!options.drawFloors){
				return;
			}

			if (!debugFloors){
				f.scrollable.css({position: 'relative'});
				debugFloors = [];
				for (i = 0; i < totalTops; i++){
					var line = $('<div></div>');
					line.css({
						backgroundColor: 'red',
						height: '1px',
						width: '100%',
						left: '0',
						top: '0',
						position: 'absolute',
						zIndex: '1000000'
					});
					debugFloors.push(line);
					f.scrollable.append(line);
				}
			}

			for (i = 0; i < totalTops; i++){
				topWithOffset = top[i] + ((typeof f.offset === 'function') ? f.offset(dir) : f.offset);
				debugFloors[i].css({
					top: topWithOffset
				}).html(topWithOffset + 'px');
			}
		}

		(function init(){
			refresh();
		})();

		return {
			execute: execute,
			refresh: refresh
		};
	}


	function Elevator(){

		var floors = [],
			totalFloors = 0,
			currentScrollTop = 0,
			$scrollable = $(window);

		function onScroll(){
			var i,
				scrollTop = $(this).scrollTop();

			for (i = 0; i < totalFloors; i++){
				floors[i].execute(currentScrollTop, scrollTop);
			}

			currentScrollTop = scrollTop;
		}

		function onResize(){
			var i;
			for (i = 0; i < totalFloors; i++){
				floors[i].refresh();
			}
		}

		function config(options){
			if (options.element){
				$scrollable.off('scroll');
				$scrollable = $(options.element);
				$scrollable.on('scroll', onScroll);
			}
		}

		function on(options){
			// inject current elevator scrollable to each floor
			options.scrollable = $scrollable;
			var floor = new Floor(options);
			floors.push(floor);
			totalFloors = floors.length;
			return floor;
		}

		function listen(){
			$scrollable.on('scroll', onScroll).on('resize', onResize);

			// re-measure in case stuff has not finished loading
			setTimeout(onResize, 1000);
		}

		(function init(){
			listen();
		})();

		return {
			config: config,
			on: on
		};
	}

	// Make it a jQuery plugin
	$.elevator = (function(){
		var elevator;

		function config(options){
			elevator.config(options);
			return this;
		}

		function on(options){
			var settings = $.extend({
				element: false,
				dir: 'both',
				once: false,
				offset: 0,
				callback: false
			}, options);

			return elevator.on(settings);
		}

		(function init(){
			elevator = new Elevator();
		})();

		return {
			config: config,
			on: on
		};
	})();

}(jQuery));