/**
 * Panel.js
 * 
 */

(function($){
	'use strict';

	window.Basecoat = window.Basecoat || {};

	Basecoat.panels = (function(){

		function resizePanel(e){
			var $el = $(e.target);
			console.log(e.target);

		}

		function enable(){
			$( document ).on('click', '.panel .resize-handle', resizePanel);
		}

		function disable(){
			$( document ).off('click', '.panel .resize-handle', resizePanel);
		}

		function addEventListeners(){
			enable();
		}

		(function init(){
			addEventListeners();
		})();

		return {
			enable: enable,
			disbale: disable
		};
	})();

})(jQuery);