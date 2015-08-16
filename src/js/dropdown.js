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
			$select = $('<div class="select"></div>'),
			prefix = settings.prefix,
			suffix = settings.suffix,
			$label = $('<div class="label"></div>'),
			$listContainer = $('<div class="list-container"></div>'),
			$list = $('<ul class="list"></ul>'),
			$moreUpIndicator = $('<div class="more-up">up</div>'),
			$moreDownIndicator = $('<div class="more-down">down</div>'),
			$options,
			$placeholder = false,
			$focused = false,
			_multiple = false,
			_textInput = '',
			_textInputTimeout = 0,
			CLICK = ("ontouchstart" in window) ? 'touchstart' : 'click';


		function reset() {
			focusOption(false);
			$list.find('li').removeClass('selected');
		}

		function showOverflowIndicators(){
			var listHeight = $list.height(),
				totalHeight = $list.prop('scrollHeight'),
				scrollTop = $list.scrollTop();
				
			if (scrollTop === 0){
				$moreUpIndicator.hide();
			}else{
				$moreUpIndicator.show();
			}

			if (scrollTop >= totalHeight - listHeight - 1){ // strange behavior when scrolling does not match key 
				$moreDownIndicator.hide();
			}else{
				$moreDownIndicator.show();
			}
		}

		function scrolled(){
			showOverflowIndicators();
		}

		function scrollToFocused(){
			if (!$focused){
				return;
			}

			var delta,
				top = $focused.position().top,
				optionHeight = $focused.height(),
				listHeight = $list.height(),
				scrollTop = $list.scrollTop();

			if ($moreUpIndicator.is(':visible') && $moreUpIndicator.css('position') !== 'absolute'){
				top -= $moreUpIndicator.height();
			}

			if (top < 0){
				$list.scrollTop( top + scrollTop );
			}else if (top >= listHeight){
				$list.scrollTop( scrollTop + top - listHeight + optionHeight);
			}

			showOverflowIndicators();
		}

		function focusOption($option){
			if ($focused){
				$focused.removeClass('focused');
			}
			$focused = $option;
			if ($focused){
				$focused.addClass('focused');
			}

			scrollToFocused();
		}

		function up() {
			var prev;

			if ($focused){
				prev = $focused.prev();
			}else{
				prev = $list.find('li').first();
			}

			if (prev.length){
				focusOption(prev);
			}
		}

		function down() {
			var next;

			if ($focused){
				next = $focused.next();
			}else{
				next = $list.find('li').first();
			}

			if (next.length){
				focusOption(next);
			}
		}

		function onKey(e)
		{
			clearTimeout(_textInputTimeout);

			if (e.keyCode === 9) {
				// tab
				close();
				_textInput = '';
				return;
			} else if (e.keyCode === 38) {
				// up arrow
				e.preventDefault();
				_textInput = '';
				up();
			} else if (e.keyCode === 40) {
				// down arrow
				e.preventDefault();
				_textInput = '';
				down();
			} else if (e.keyCode >= 65 && 90 >= e.keyCode || e.keyCode >= 48 && 57 >= e.keyCode) {
				// alphanumeric
				e.preventDefault();
			} else if (e.keyCode === 13 || e.keyCode === 32) {
				// enter or spacebar
				e.preventDefault();

				if (isOpen()) {
					selectOption({
						currentTarget: $focused
					});
					close();
				} else {
					open();
				}

				_textInput = '';
				return;
			} else {
				_textInput = '';
				return;
			}

			open();

			_textInput += String.fromCharCode(e.keyCode);
			_textInputTimeout = setTimeout(function() {
				_textInput = '';
			}, 1000);

			$.each($list.find('li'), function(i, li){
				if (_textInput.toLowerCase() === li.innerHTML.substr(0, _textInput.length).toLowerCase()){
					focusOption($(li));
					return false;
				}
			});

			if (settings.onTextInput){
				settings.onTextInput(_textInput, $focused, $list);
			}
		}

		function onTextInput(textInput, $focused, $list){
			
		}

		function focusedSelect(){
			$select.on('keydown', onKey);
		}

		function blurredSelect(){
			$select.off('keydown', onKey);
		}

		function open(){
			if ($listContainer.width() <= $select.outerWidth()) {
				$list.width($select.outerWidth());
				$listContainer.css('left', $select.position().left);
			}else{
				$list.width('auto');
			}

			$select.addClass('open');
			showOverflowIndicators();
			$('body').on(CLICK, close);
		}

		function close(){
			$select.removeClass('open');
			$('body').off(CLICK, close);
		}

		function isOpen(){
			return $select.hasClass('open');
		}

		function toggleSelect(e){
			e.stopPropagation();
			if (isOpen()){
				close();
			}else{
				open();
			}
		}

		function formatLabel($label, $selected, _multiple){
			var label;

			if (_multiple){
				if ($selected.length === 1){
					label = $selected.first().html();
				}else{
					label = $selected.length + ' Items';
				}
			}else{
				label = $selected.first().html();
			}

			return '<div class="prefix">' + prefix + '</div>' + label + '<div class="suffix">' + suffix + '</div>';
		}

		function sync(){
			var $li, $option;

			$.each($list.find('li'), function(i, li){
				$li = $(li);
				$option = $($options[i]);

				if ($li.hasClass('selected')){
					$option.attr('selected', 'selected');
				}else{
					$option.removeAttr('selected');
				}
			});
		}

		function refresh(){
			if ($list.find('.selected').length === 0){
				if ($placeholder){
					$placeholder.addClass('selected');
				}else{
					$list.find('li').first(0).addClass('selected');
				}
			}

			var label = '',
				$selected = $list.find('.selected');

			if (typeof settings.labelFormatter === 'function'){
				label = settings.labelFormatter($label, $selected, _multiple);
			}else{
				label = formatLabel($label, $selected, _multiple);
			}

			$label.html(label);

			sync();
		}

		function selectOption(e){
			var $li = $(e.currentTarget);

			if (_multiple && $li.hasClass('selected')){
				$li.removeClass('selected');
			}else{
				if (!_multiple){
					reset();
				}
				focusOption($li);
				$li.addClass('selected');
			}

			refresh();
		}

		function buildOption($option){
			var $li = $('<li></li>');
			$li.html($option.html())
				.addClass($option.attr('class'))
				.on(CLICK, {}, selectOption);

			if (!!$option.attr('id')){
				$li.attr('id', 'select-' + $option.attr('id'));
			}

			if ($option.hasClass('placeholder') || $option.val() === 'undefined'){
				$placeholder = $li;
				$placeholder.addClass('placeholder');
			}

			return $li;
		}

		function build(){
			$options = $el.find('option');
			$select.addClass($el.attr('class'));
			$select.attr('tabindex', 0);
			//$moreUpIndicator.hide();
			//$moreDownIndicator.hide();
			_multiple = !!$el.attr('multiple');
			if (_multiple){
				$select.addClass('multiple');
			}

			$.each($options, function(i, option){
				$list.append(buildOption($(option)));
			});

			$listContainer.append($moreUpIndicator)
							.append($list)
							.append($moreDownIndicator);

			$select.append($label)
				.append($listContainer)
				.insertBefore($el);

			$select.append($el.remove().hide());

			$list.on('scroll', scrolled);
			
			$select.on(CLICK, {}, toggleSelect)
					.on('focus', {}, focusedSelect)
					.on('blur', {}, blurredSelect);

			refresh();
		}

		(function init(){
			build();
		})();

	}

	$.fn.select = function(options) {
		var defaults = {
				onTextInput: false,
				labelFormatter: false,
				prefix: '',
				suffix: '&#9660;'
			},
			settings = $.extend({}, defaults, options);

		return this.each(function() {
			new Select(this, settings);
		});
	};

	$('select').not('.native').select();

})(jQuery);


