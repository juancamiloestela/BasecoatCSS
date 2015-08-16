module.exports = function(grunt) {

	require('time-grunt')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		dev: "src",

		prod: "build",

		// Validate JS
		jshint: {
			all: [
				"Gruntfile.js",
				"<%= dev %>/js/**/*.js"
			]
		},


		// Less compiler
		less: {
			css: {
				files: {
					'<%= dev %>/css/<%= pkg.name %>.css': '<%= dev %>/less/<%= pkg.name %>.less',
					'<%= dev %>/css/site.css': '<%= dev %>/less/site.less',
					// Components
					'<%= dev %>/css/components/checkboxjs.css': '<%= dev %>/less/components/checkboxjs.less',
					'<%= dev %>/css/components/selectjs.css': '<%= dev %>/less/components/selectjs.less',
					'<%= dev %>/css/components/peekjs.css': '<%= dev %>/less/components/peekjs.less',
					// Coats
					'<%= dev %>/css/coats/colors.css': '<%= dev %>/less/coats/colors.less',
					'<%= dev %>/css/coats/fonts.css': '<%= dev %>/less/coats/fonts.less',
					'<%= dev %>/css/coats/pressable.css': '<%= dev %>/less/coats/pressable.less',
					'<%= dev %>/css/coats/rounded.css': '<%= dev %>/less/coats/rounded.less',
					'<%= dev %>/css/coats/fancy.css': '<%= dev %>/less/coats/fancy.less'
				},
				options: {
					//compress: true,
					//cleancss: true,
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
					'<%= dev %>/css/<%= pkg.name %>.css': '<%= dev %>/css/<%= pkg.name %>.css',
					// Components
					'<%= dev %>/css/components/checkboxjs.css': '<%= dev %>/css/components/checkboxjs.css',
					'<%= dev %>/css/components/selectjs.css': '<%= dev %>/css/components/selectjs.css',
					'<%= dev %>/css/components/peekjs.css': '<%= dev %>/css/components/peekjs.css',
					// Coats
					'<%= dev %>/css/coats/colors.css': '<%= dev %>/css/coats/colors.css',
					'<%= dev %>/css/coats/fonts.css': '<%= dev %>/css/coats/fonts.css',
					'<%= dev %>/css/coats/pressable.css': '<%= dev %>/css/coats/pressable.css',
					'<%= dev %>/css/coats/rounded.css': '<%= dev %>/css/coats/rounded.css'
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

		assemble: {
			options:{
				layoutdir: '<%= dev %>/html/layouts',
				flatten: true,
				layout: 'default.hbs',
				partials: '<%= dev %>/html/partials/**/*.hbs',
				helpers: ['helpers/**/*.js']
			},
			page: {
				files: {
					'<%= dev %>/': ['<%= dev %>/html/pages/**/*.hbs']
				}
			}
		},

		sampleCode: {
			basic:{
				files: [{
					expand:true,
					src: '<%= dev %>/*.html',
					dest: ''
				}]
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

		useminPrepare:{
			html: '<%= dev %>/index.html',
			options:{
				dest: '<%= prod %>'
			}
		},

		usemin:{
			html:['<%= prod %>/*.html', '<%= prod %>/partials/**/*.html'],
			css: ['<%= prod %>/css/*.css'],
			options: {
				dirs: ['<%= prod %>'],
				assetsDirs: ['<%= prod %>']
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
							'css/**/*.map',
							'js/**/*.map',
							'fonts/**',
							'img/**',
							'api/**',
							'partials/**',
							'*.html',
							'*.txt',
							'*.ico',
							'*.png'
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
				src: ['package.json', 'bower.json', '<%= prod %>/js/*.js']
			},
			minor:{
				options: {
					release: 'minor'
				},
				src: ['package.json', 'bower.json', '<%= prod %>/js/*.js']
			},
			major:{
				options: {
					release: 'major'
				},
				src: ['package.json', 'bower.json', '<%= prod %>/js/*.js']
			}
		},

		// Watch Plugin
		watch: {
			less: {
				// We watch and compile less files as normal but don't live reload here
				files: ['<%= dev %>/less/**/*.less', '<%= dev %>/html/**/*.hbs'],
				tasks: ['less', 'autoprefixer', 'stripmq', 'assemble', 'sampleCode']
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
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-stripmq');
	grunt.loadTasks('tasks');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'less', 'autoprefixer', 'stripmq', 'newer:assemble', 'sampleCode']);
	grunt.registerTask('build', ['default', 'assemble', 'clean', 'copy:main', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'version:patch']);
	grunt.registerTask('minor', ['build', 'version:minor']);
	grunt.registerTask('major', ['build', 'version:major']);
};