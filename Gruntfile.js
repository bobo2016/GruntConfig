module.exports = function(grunt){
	var sassStyle = 'expanded';

	grunt.initConfig({	
		//task configuration
		pkg: grunt.file.readJSON('package.json'),

		//check js syntax
		jshint: {
			all: ['./global.js']
		},

		//compile scss files
		sass: {
			output: {
				options :{
					style: sassStyle
				},
				files: {
					'./build/css/style.css': './scss/style.scss'
				}
			}
		},

		//concat js file(first, then minify)
		concat:{
			options:{
				separator: ";"
			},
			dist:{
				src:['./src/plugin.js','./src/plugin2.js'],
				dest: './build/js/global.js'
			}
		},

		//minify css file
		cssmin:{
			options: {
		      banner: '/*!minified css <%= grunt.template.today("yyyy-mm-dd") %>*/'
		    },
			combine:{
				files:{
					'./build/css/style.min.css': ['./build/css/style.css','./build/css/custom.css']
				}
			}
		},

		
		//minify js file
		uglify:{
			options:{
				 banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			my_target:{
				files:{
					'./build/js/global.min.js': ['./build/js/global.js']
				}		
			}
		},

		//add version number for static files
		hash:{
			options:{
				hashLength: 8,
				hashFunction: function(source, encoding){ // default is md5 
	                return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
	            }
			},
			js:{
				src: './build/js/global.min.js',
				dest: './dest/js/'
			},
			css:{
				src: './build/css/style.css',
				dest: './dest/css/'
			}
		},

		//update changes when save
		watch:{
			scripts:{
				files: ['./src/plugin.js','./src/plugin2.js'],
        		tasks: ['concat','jshint','uglify']
			},
			sass: {
		        files: ['./scss/style.scss','./build/css/custom.css'],
		        tasks: ['sass','cssmin']
		    },
		    livereload: {
		          options: {
		              livereload: '<%= connect.options.livereload %>'
		          },
		          files: [
		              'index.html',
		              'style.css',
		              'js/global.min.js'
		          ]
		    }
		},


		//connect the local server
		connect:{
			options:{
				port: 9000,
				open: true,
				livereload: 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			server:{
				options:{
					port: 8888,
					base: './'
				}
			}		
		}


		//create new local server to refresh the html file automatically
	});

	//load the plugin
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-hash');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	

	//Default task(s)
	grunt.registerTask('outputcss',['sass']);
	grunt.registerTask('minifycss',['cssmin']);
	grunt.registerTask('concatjs',['concat']);
	grunt.registerTask('build',['concat','jshint','uglify','hash']);
	grunt.registerTask('addVersion',['hash']);
	grunt.registerTask('watchit',['sass','cssmin','concat','jshint','uglify','hash','connect','watch']);
	grunt.registerTask('default');	
};
