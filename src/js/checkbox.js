/*!
 * Checkbox.js
 * http://www.github.com/juancamiloestela/checkbox.js
 * MIT licensed
 * Version 0.1
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


