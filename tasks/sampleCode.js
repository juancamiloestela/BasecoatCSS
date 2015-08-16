/**
 * Grunt task to extract demo code, escape it and inject it 
 * into document as sample code.
 */

var cheerio = require('cheerio');

module.exports = function (grunt) {
	grunt.registerMultiTask('sampleCode', 'your task description', function () {

		this.files.forEach(function(f) {
			var src = f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				}
				return true;
			}).map(function(filepath, i) {
				if (grunt.file.isDir(filepath)) {
					return;
				}

				var src = grunt.file.read(filepath),
					$ = cheerio.load(src),
					$examples = $('.example');

				$examples.each(function(i, el){
					var $example = $(el),
						$source = $example.siblings('.source');

					var source = $example.html().replace(/\n/, ''), // remove the first line break
						lines,
						indent;

					if ($example.children('.browser-window').length){
						source = $example.find('.browser-content').html().replace(/\n/, '');
					}

					if (!source.length){
						return;
					}

					lines = source.split(/\n/); // get all code by lines
					if (lines.length){
						indent = lines[0].match(/\s+/); // get first line indent offset
					}

					for(var l in lines){
						if (indent){
							lines[l] = lines[l].replace(indent[0], '');
						}
					}

					$source.find('code').text( "\n" + lines.join("\n") );
				});
				
				grunt.file.write(f.dest, $.html());
				grunt.log.writeln('File "' + f.dest + '" written.');
			});
		});
	});
};