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
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			dist: {
				src: [
					'<%= dev %>/src/basecoat.js',
					'<%= dev %>/src/console.js',
					'<%= dev %>/bower_components/peekjs/dist/js/peek.js',
					'<%= dev %>/bower_components/selectjs/dist/js/select.js',
					'<%= dev %>/bower_components/checkboxjs/dist/js/checkbox.js',
					'<%= dev %>/bower_components/dismissablejs/dist/js/dismissable.js',
					'<%= dev %>/bower_components/sequence-js/dist/js/sequence.js',
					'<%= dev %>/bower_components/brokenjs/dist/js/broken.js'
				],
				dest: '<%= dev %>/js/<%= pkg.name %>.js'
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
					'<%= dev %>/js/<%= pkg.name %>.min.js': ['<%= dev %>/js/<%= pkg.name %>.js']
				}
			}
		},

		// Less compiler
		less: {
			css: {
				files: {
					'<%= dev %>/css/<%= pkg.name %>.css': '<%= dev %>/less/<%= pkg.name %>.less'
				},
				options: {
					sourceMap: true,
					sourceMapFilename: '<%= dev %>/css/<%= pkg.name %>.css.map',
					sourceMapRootpath: '../../',
					sourceMapURL: '<%= pkg.name %>.css.map'
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
					'<%= dev %>/css/<%= pkg.name %>.css': '<%= dev %>/css/<%= pkg.name %>.css'
					/*// Components
					'<%= dev %>/css/components/checkboxjs.css': '<%= dev %>/css/components/checkboxjs.css',
					'<%= dev %>/css/components/selectjs.css': '<%= dev %>/css/components/selectjs.css',
					'<%= dev %>/css/components/peekjs.css': '<%= dev %>/css/components/peekjs.css',
					// Coats
					'<%= dev %>/css/coats/colors.css': '<%= dev %>/css/coats/colors.css',
					'<%= dev %>/css/coats/fonts.css': '<%= dev %>/css/coats/fonts.css',
					'<%= dev %>/css/coats/pressable.css': '<%= dev %>/css/coats/pressable.css',
					'<%= dev %>/css/coats/rounded.css': '<%= dev %>/css/coats/rounded.css'*/
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
				'<%= dev %>/css/<%= pkg.name %>-oldie.css': ['<%= dev %>/css/<%= pkg.name %>.css']
				}
			}
		},

		cssmin: {
			dist: {
				files: {
					'<%= dev %>/css/<%= pkg.name %>.min.css': ['<%= dev %>/css/<%= pkg.name %>.css'],
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
			options: {
				release: 'patch'
			},
			patch: {
				src: ['package.json', 'bower.json', '<%= prod %>/js/*.js', '<%= prod %>/css/*.css']
			},
			minor:{
				options: {
					release: 'minor'
				},
				src: ['package.json', 'bower.json', '<%= prod %>/js/*.js', '<%= prod %>/css/*.css']
			},
			major:{
				options: {
					release: 'major'
				},
				src: ['package.json', 'bower.json', '<%= prod %>/js/*.js', '<%= prod %>/css/*.css']
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
	grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'less', 'autoprefixer', 'stripmq', 'cssmin']);
	grunt.registerTask('build', ['default', 'clean', 'copy:main', 'version:patch']);
	grunt.registerTask('minor', ['build', 'version:minor']);
	grunt.registerTask('major', ['build', 'version:major']);
};