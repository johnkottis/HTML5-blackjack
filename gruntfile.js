module.exports = function (grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Downloads bower dependencies
        bower: {
            install: {

            }
        },

        // copy files from bower components
        bowercopy: {
            options: {
                clean: false
            },
            javascript: {
                options: {
                    destPrefix: 'Libs'
                },
                files: {
                    'jquery.js': 'jquery/dist/jquery.js'
                },
            },
            folders: {
                options: {
                    destPrefix: 'ContentCommon/Libs'
                },
                files: {
                    'bootstrap': 'bootstrap',
                    'bootstrap-select': 'bootstrap-select',
                    'awesome-bootstrap-checkbox': 'awesome-bootstrap-checkbox',
                    'ng-image-input-with-preview': 'ng-image-input-with-preview',
                    'bootstrap-slider': 'bootstrap-slider'
                }
            },
        },

        // Concat js files
        concat: {
            options: {
                separator: ';',
            },
            distCommon: {
                src: ['Libs/jquery.js', 'assets/js/backjack-core.js'],
                dest: 'public/js/scripts.js'
            }
        },

        // Validate files with JSHint.
        jshint: {
            beforeUglify: ['Gruntfile.js', 'assets/js/**/*.js','assets/tests/**/*.js'],
            afterUglify: ['public/js/scripts.js'],
        },

        // Run unit tests.
       jasmine: {
           pivotal: {
               src: 'public/js/scripts.js',
               options: {
                   specs: 'assets/tests/spec/*.spec.js',
                   helpers: 'assets/tests/spec/*.helper.js',
                   summary: true,
                   junit: {
                       path: 'junit'
                   }
               }
           }
       },

        // Minify files with UglifyJS.
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: 'sourceMap.map',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }
        },

        // Compile Sass to CSS
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'Sass',
                    src: ['*.scss'],
                    dest: 'Temp/TempCompiled',
                    ext: '.css'
                }]
            }
        },

        // Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use website.
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', '> 5%']
            },
            main: {
                expand: true,
                flatten: true,
                src: 'Temp/TempCompiled',
                dest: 'Temp/TempPrefixes'
            }
        },

        // Concat CSS with @import statements at top and relative url preserved
        concat_css: {
            commonStyles: {
                src: ['Temp/TempPrefixes/*'],
                dest: 'public/css/styles.css'
            }
        },

        // Validate CSS
        csslint: {
            strict: {
                options: {
                    import: 2
                },
                src: ['public/css/**/*.css']
            }
        },

        // Structural optimization of CSS files.
        csso: {
            dynamic_mappings: {
                expand: true,
                cwd: 'Temp/TempPrefixes',
                src: ['*.css', '!*.min.css'],
                dest: 'release/css',
                ext: '.min.css'
            }
        },

        // Clean files and folders.
        clean: {
            temp: ['Temp', 'bower_components', 'junit', '_tests']
        },s
    });

    grunt.registerTask('deploy', ['bowercopy', 'concat', 'jasmine', 'uglify', 'concat_css', 'csso', 'clean']);
};
