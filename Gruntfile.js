module.exports = function(grunt) {

	require('time-grunt')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		dev: "src",

		prod: "dist",

		jshint: {
			all: [
				"Gruntfile.js",
				"<%= dev %>/src/**/*.js"
			]
		},

		concat: {
			options: {
				stripBanners: true,
				banner: '/*! basecoat - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			dist: {
				src: [
					'<%= dev %>/src/basecoat.js',
					'<%= dev %>/src/console.js',
					//'<%= dev %>/bower_components/peek-js/src/js/peek.js',
					'<%= dev %>/bower_components/select-js/src/js/select.js',
					'<%= dev %>/bower_components/checkbox-js/src/js/checkbox.js',
					'<%= dev %>/bower_components/dismissable-js/src/js/dismissable.js',
					'<%= dev %>/bower_components/sequence-js/src/js/sequence.js',
					'<%= dev %>/bower_components/broken-js/src/js/broken.js'
				],
				dest: '<%= dev %>/js/basecoat.js'
			}
		},

		uglify: {
			options: {
				mangle: {
					except: ['jQuery']
				},
				sourceMap: true
			},
			my_target: {
				files: {
					'<%= dev %>/js/basecoat.min.js': ['<%= dev %>/js/basecoat.js']
				}
			}
		},

		// Less compiler
		less: {
			css: {
				files: {
					'<%= dev %>/css/basecoat.css': '<%= dev %>/less/basecoat.less'
				},
				options: {
					sourceMap: true,
					sourceMapFilename: '<%= dev %>/css/basecoat.css.map',
					sourceMapRootpath: '../../',
					sourceMapURL: 'basecoat.css.map'
				},
			}
		},

		// Auto vendor prefixes
		autoprefixer: {
			options: {
				browsers: ['last 4 versions']
			},
			css: {
				files: {
					'<%= dev %>/css/basecoat.css': '<%= dev %>/css/basecoat.css'
				}
			}
		},

		stripmq: {
			//Viewport options 
			options: {
				width: 1000,
				type: 'screen'
			},
			all: {
				files: {
				//follows the pattern 'destination': ['source'] 
				'<%= dev %>/css/basecoat-oldie.css': ['<%= dev %>/css/basecoat.css']
				}
			}
		},

		cssmin: {
			dist: {
				files: {
					'<%= dev %>/css/basecoat.min.css': ['<%= dev %>/css/basecoat.css'],
				}
			}
		},

		notify: {
			task_name: {
				options: {
				// Task-specific options go here.
				}
			},
			watch: {
				options: {
					//title: '',
					message: 'Less and Uglify finished running', //required
				}
			}
		},

		clean: ['<%= prod %>'],

		copy: {
			main: {
				files: [
					// media
					{
						expand: true,
						cwd: '<%= dev %>/',
						src: [
							'css/**/*',
							'js/**/*'
						],
						dest: '<%= prod %>/'
					}
				]
			}
		},

		version: {
			options:{
				prefix: '(\\* |")?[Vv]ersion[\'"]?\\s*[:=]?\\s*[\'"]?'
			},
			defaults: {
				src: ['bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.less']
			},
			patch: {
				options: {
					release: 'patch'
				},
				src: ['package.json', 'bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.less']
			},
			minor:{
				options: {
					release: 'minor'
				},
				src: ['package.json', 'bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.less']
			},
			major:{
				options: {
					release: 'major'
				},
				src: ['package.json', 'bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.less']
			}
		},

		watch: {
			less: {
				files: ['<%= dev %>/less/**/*.less', '<%= dev %>/src/**/*.js'],
				tasks: ['default']
			}
		}
	});

	// Load project tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-stripmq');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'version:defaults', 'concat', 'uglify', 'less', 'autoprefixer', 'cssmin']);
	grunt.registerTask('build', ['version:patch', 'default', 'clean', 'copy:main']);
	grunt.registerTask('minor', ['build', 'version:minor']);
	grunt.registerTask('major', ['build', 'version:major']);
};