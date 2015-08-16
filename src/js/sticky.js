/*global*/

(function($){
'use strict';

	$(function(){

		var $viewport = $('.wrapper'),
			$hero = $('.hero-wrapper'),
			heroHeight = $hero.height(),
			$menu = $('nav.main'),
			$clone = $menu.clone(),
			$sticky = $('.sticky').append($clone),
			visible = false,
			documentHeight = $viewport[0].scrollHeight * 1.5;

		hide();

		$('body').append($sticky);

		function show(){
			$sticky.addClass('visible');
			visible = true;
		}

		function hide(){
			$sticky.removeClass('visible');
			visible = false;
		}

		$viewport.scroll(function(){
			var $this = $(this),
				scrollTop = $this.scrollTop();

			if (scrollTop >= heroHeight && !visible){
				show();
			}else if(scrollTop <= heroHeight && visible){
				hide();
			}

			$sticky.css({'background-position':'0 -' + (450 * scrollTop/documentHeight) + 'px'});
		});

	});

}(jQuery || $));