/*global*/

/* TODO: 
- this could be made more efficient:
	- remove jquery as much as possible
	- optimize style attribute removal
 */
(function($){
'use strict';

	var supportsTouch = ("ontouchstart" in window),
		EVENT = (supportsTouch ?
				{
					START: 'touchstart',
					MOVE: 'touchmove',
					CLICK: 'touchend',
					END: 'touchend'
				} :
				{
					START: 'mousedown',
					MOVE: 'mousemove',
					CLICK: 'click',
					END: 'mouseup'
				}),
		supportsTransforms = false,
		$content = $('.peek-container'),
		$contentOverlay = $('.peek-overlay'),
		$leftMenu = $('.peek-left-content'),
		$rightMenu = $('.peek-right-content'),
		hasLeft = $leftMenu.length > 0 ? true : false,
		hasRight = $rightMenu.length > 0 ? true : false,
		$body = $(document.body),
		$window = $(window),
		leftClosed = true,
		rightClosed = true,
		dragging = false,
		start = {x:0, y:0},
		threshold = 200,
		ignoreY = false,
		intent = '',
		effect = false,
		callbacks = {
			openRight: false,
			openLeft: false,
			closeRight: false,
			closeLeft: false
		};


	function detectEffect(){
		effect = document.body.className.match(/peek-effect-[a-z-]+/);
		effect = (effect) ? effect[0].replace('peek-effect-','') : false;
	}

	function toggleLeft(e){
		if (e){ e.preventDefault(); }
		if (leftClosed){
			open('left');
		}else{
			close('left');
		}
	}

	function toggleRight(e){
		if (e){ e.preventDefault(); }
		if (rightClosed){
			open('right');
		}else{
			close('right');
		}
	}

	function open(side){
		dragging = false;

		$content.attr('style', '');
		$rightMenu.attr('style', '');
		$leftMenu.attr('style', '');

		if (side === 'left' && hasLeft){
			if (typeof callbacks.onOpenLeft === 'function'){
				callbacks.onOpenLeft();
			}
			$body.addClass('peek-left');
			leftClosed = false;
		}else if(side === 'right' && hasRight){
			if (typeof callbacks.onOpenRight === 'function'){
				callbacks.onOpenRight();
			}
			$body.addClass('peek-right');
			rightClosed = false;
		}
		intent = '';
	}

	function close(side){
		dragging = false;

		$content.attr('style', '');
		$rightMenu.attr('style', '');
		$leftMenu.attr('style', '');

		if (side === 'left'){
			if (typeof callbacks.onCloseLeft === 'function'){
				callbacks.onCloseLeft();
			}
			$body.removeClass('peek-left');
			leftClosed = true;
		}else if(side === 'right'){
			if (typeof callbacks.onCloseRight === 'function'){
				callbacks.onCloseRight();
			}
			$body.removeClass('peek-right');
			rightClosed = true;
		}
		intent = '';
	}

	function closeAll(e){
		if (e){
			e.preventDefault();
			e.stopPropagation();
		}

		$content.attr('style', '');
		$rightMenu.attr('style', '');
		$leftMenu.attr('style', '');
		
		close('right');
		close('left');

		dragging = false;
		intent = '';
	}


	function onOpenRight(callback){
		callbacks.onOpenRight = callback;
	}

	function onOpenLeft(callback){
		callbacks.onOpenLeft = callback;
	}

	function onCloseRight(callback){
		callbacks.onCloseRight = callback;
	}

	function onCloseLeft(callback){
		callbacks.onCloseLeft = callback;
	}


	function contentTransform(dir, delta){
		var magnitude = delta.x/threshold;

		if (dir == 'right'){
			switch (effect){
				case 'door':
					return {'transform': 'translate3d(-' + (35 * magnitude) + '%,0,0) rotateY(' + (delta.x/3) + 'deg)'};
				case 'minimize':
					return {'transform': 'translate3d(-' + (55 * magnitude) + '%,0,0) scale(' + (1 + (-0.4 * magnitude)) + ')'};
				case 'lay-down':
					return {'transform': 'translate3d(0, ' + (40 * magnitude) + '%,0) rotateX(' + (75 * magnitude) + 'deg) scale(' + (1 + (-0.4 * magnitude)) + ')'};
				default:
					return {'transform': 'translate3d(-' + (55 * magnitude) + '%,0,0)'};
			}
		}else{
			switch (effect){
				case 'door':
					return {'transform': 'translate3d(' + -(35 * magnitude) + '%,0,0) rotateY(' + (delta.x/3) + 'deg)'};
				case 'minimize':
					return {'transform': 'translate3d(' + -(55 * magnitude) + '%,0,0) scale(' + (1 + (0.4 * magnitude)) + ')'};
				case 'lay-down':
					return {'transform': 'translate3d(0, ' + -(40 * magnitude) + '%,0) rotateX(' + (75 * magnitude) + 'deg) scale(' + (1 + (0.4 * magnitude)) + ')'};
				default:
					return {'transform': 'translate3d(' + -(55 * magnitude) + '%,0,0)'};
			}
		}
	}

	function sideBarTransform(dir, delta){
		var magnitude = delta.x/threshold;

		if (dir == 'right'){
			switch(effect){
				case 'lay-down':
					return {
						'transform': 'translate3d(0,' + (-100 + (105 * magnitude)) + '%,0)',
						'opacity': magnitude
					};
				default:
					return {
						'transform': 'translate3d('+ (100 - (105 * magnitude)) + '%,0,0)',
						'opacity': magnitude
					};
			}
		}else{
			switch(effect){
				case 'lay-down':
					return {
						'transform': 'translate3d(0,' + (-100 - (105 * magnitude)) + '%,0)',
						'opacity': -magnitude
					};
				default:
					return {
						'transform': 'translate3d('+ (-100 - (105 * magnitude)) + '%,0,0)',
						'opacity': -magnitude
					};
			}
		}
	}


	function anyTransition(){
		if (!/peek-transitioning/.test(document.body.className)){
			document.body.className += ' peek-transitioning ';
		}
	}

	function openingTransition(){
		anyTransition();
		if (!/peek-opening-transition/.test(document.body.className)){
			document.body.className += ' peek-opening-transition ';
		}
	}

	function closingTransition(){
		anyTransition();
		if (!/peek-closing-transition/.test(document.body.className)){
			document.body.className += ' peek-closing-transition ';
		}
	}

	function clearTransition(){
		document.body.className = document.body.className
												.replace(/ ?peek-transitioning ?/, ' ')
												.replace(/ ?peek-opening-transition ?/, ' ')
												.replace(/ ?peek-closing-transition ?/, ' ');
	}

	function startDrag(e){
		//e.preventDefault();
		dragging = true;
		detectEffect();
		start.x = supportsTouch ? e.touches[0].pageX : e.pageX;
		start.y = supportsTouch ? e.touches[0].pageY : e.pageY;

		$content.css({
			'transition': 'none'
		});
		$rightMenu.css({
			'transition': 'none'
		});
		$leftMenu.css({
			'transition': 'none'
		});
		intent = '';
		ignoreY = false;
	}

	function drag(e){
		if (dragging){

			var x = supportsTouch ? e.touches[0].pageX : e.pageX,
				y = supportsTouch ? e.touches[0].pageY : e.pageY,
				delta = {
					x: start.x - x,
					y: start.y - y
				};

			intent = '';

			if (Math.abs(delta.y) > 5 && !ignoreY){
				dragging = false;
				return;
			}

			e.preventDefault();
			ignoreY = true;

			if (delta.x > 5){ // x threshold TODO: make this configurable
				if (delta.x > threshold){
					delta.x = threshold;
				}
				// swiping left
				if (!leftClosed){
					// close left
					closingTransition();
					intent = (delta.x > (threshold/2)) ? 'closeLeft' : '';
				}else if (leftClosed && rightClosed){
					// open right
					if ($rightMenu.length){
						openingTransition();

						intent = (delta.x > (threshold/2)) ? 'openRight' : '';
						$content.css(contentTransform('right', delta));

						$rightMenu.css(sideBarTransform('right', delta));
					}
				}
			}else if (delta.x < 0){
				if (delta.x < -threshold){
					delta.x = -threshold;
				}
				// swiping left
				if (!rightClosed){
					// close right
					closingTransition();
					intent = (delta.x < -(threshold/2)) ? 'closeRight' : '';
				}else if (leftClosed && rightClosed){
					// open left
					if ($leftMenu.length){
						openingTransition();

						intent = (delta.x < -(threshold/2)) ? 'openLeft' : '';
						$content.css(contentTransform('left', delta));

						$leftMenu.css(sideBarTransform('left', delta));
					}
				}
			}
		}
	}

	function endDrag(e){
		dragging = false;

		if (intent === 'openRight'){
			open('right');
		}else if (intent === 'closeRight'){
			close('right');
		}else if (intent === 'openLeft'){
			open('left');
		}else if (intent === 'closeLeft'){
			close('left');
		}

		clearTransition();
		$content.attr('style', '');
		$rightMenu.attr('style', '');
		$leftMenu.attr('style', '');
	}

	function buildRequiredElements(){
		if (!$contentOverlay.length){
			$contentOverlay = $('<div class="peek-overlay"></div>');
			$body.append($contentOverlay);
		}
	}

	function addEventListeners(){
		if (supportsTouch){
			document.body.addEventListener(EVENT.START, startDrag, true);
			document.body.addEventListener(EVENT.MOVE, drag, false);
			document.body.addEventListener(EVENT.END, endDrag, false);
		}
		if ($contentOverlay.length){
			$contentOverlay.bind(EVENT.CLICK, closeAll);
		}

		$body.on(EVENT.CLICK, '.peek-toggle-left', toggleLeft);
		$body.on(EVENT.CLICK, '.peek-toggle-right', toggleRight);
		$body.on(EVENT.CLICK, '.peek-close-all', function(){ closeAll(); });
		$body.on(EVENT.CLICK, '.peek-open-right', function(){ open('right'); });
		$body.on(EVENT.CLICK, '.peek-open-left', function(){ open('left'); });
		$body.on(EVENT.CLICK, '.peek-close-right', function(){ close('right'); });
		$body.on(EVENT.CLICK, '.peek-close-left', function(){ close('left'); });
	}

	// Expose public methods
	window.Peekjs = {
		toggleLeft: toggleLeft,
		toggleRight: toggleRight,
		openRight: function(){ open('right'); },
		openLeft: function(){ open('left'); },
		closeRight: function(){ close('right'); },
		closeLeft: function(){ close('left'); },
		closeAll: closeAll,
		onOpenRight: onOpenRight,
		onOpenLeft: onOpenLeft,
		onCloseRight: onCloseRight,
		onCloseLeft: onCloseLeft
	};

	$(function(){
		buildRequiredElements();
		addEventListeners();
		detectEffect();
	});

}(jQuery || $));