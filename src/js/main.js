/*global*/

(function($){
'use strict';

	$(function(){
		var $head = $('.head'),
			$currentSectionLabel = $('.js-current-section');


		$.elevator.config({
			element: $('.content')
		});

		$.elevator.on({
			offset: 100,
			callback: function(trigger, direction){
				console.log('triggered ', trigger, direction);
				if (direction === 'down'){
					$head.removeClass('large').removeClass('shrinked');
				}else{
					$head.addClass('shrinked').addClass('large').removeClass('open');
				}
			}
		});

		$.elevator.on({
			element: $('a[name]'),
			offset: function(){
				return -$(window).height()/3;
			},
			callback: function(trigger, direction){
				console.log('triggered ', trigger, direction);
				var section = trigger.name.replace('-', ' ');
				$currentSectionLabel.html(section);
				if (section === ''){
					$head.removeClass('open');
				}else{
					$head.addClass('open');
				}
			}
		});



		var $body = $('body'),
			$checkboxes = $('.peek-right input[type="checkbox"]'),
			$radios = $('.peek-right input[type="radio"]');
		
		$checkboxes.change(function(e){
			var $this = $(this);

			if ($this.is(':checked')){
				$body.addClass($this.val());
			}else{
				$body.removeClass($this.val());
			}
		});

		
		$radios.change(function(e){
			var $this = $(this);

			if ($this.prop('name') === 'font-coat'){
				document.body.className = document.body.className.replace(/[a-zA-Z0-9-]+-font/ig, '');
			}else if($this.prop('name') === 'peek-effect'){
				document.body.className = document.body.className.replace(/peek-effect-[a-zA-Z0-9-]+/ig, '');
			}

			$body.addClass($this.val());
		});

	});

}(jQuery || $));



function l(){
	$.each($('h1,h2,h3,h4,h5,h6,p,a,div,li,ul,ol,tr,td,th,table,blockquote,input,nav,pre,code,button'), function(i, el) {
	var height = parseInt($(el).height(),10);
	var border = parseInt($(el).css('border-width'),10);
	var margin = parseInt($(el).css('margin-top') + $(el).css('margin-bottom'),10);
	var padding = parseInt($(el).css('padding-top') + $(el).css('padding-bottom'),10);
	
	var totalHeight = height + margin + padding + border;// + margin + padding;
	var totalRatio = Math.round((totalHeight / 26) * 100) / 100;
	var heightRatio = Math.round((height / 26) * 100) / 100;
	var marginRatio = Math.round((margin / 26) * 100) / 100;
	var paddingRatio = Math.round((padding / 26) * 100) / 100;
	var label;

	if (totalRatio % 1 === 0) {
		// is int
		label = $('<div></div>');
		label.appendTo($('.content'));
		label.html(totalRatio);
		label.css('position', 'absolute');
		label.css('color', '#fff');
		label.css('opacity', 0.7);
		label.css('background-color', 'green');
		label.css('top', $(el).offset().top);
		label.css('left', $(el).offset().left);
	} else {
		console.log(totalRatio, el);
		label = $('<div></div>');
		label.appendTo($('.content'));
		label.html(totalRatio +'/'+heightRatio+'/'+marginRatio+'/'+paddingRatio);
		label.css('position', 'absolute');
		label.css('color', '#fff');
		label.css('opacity', 0.7);
		label.css('background-color', 'red');
		label.css('top', $(el).offset().top);
		label.css('left', $(el).offset().left);
	}
});
}