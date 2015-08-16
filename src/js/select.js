/*!
 * Select.js
 * http://www.github.com/juancamiloestela/select.js
 * MIT licensed
 * Version 0.1
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


