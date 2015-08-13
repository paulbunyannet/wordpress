themeAssetPath = "public_html/wp-content/themes/mytheme/assets/";

module.exports = function (grunt) {
    // project configuration
    //noinspection JSUnresolvedFunction
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /** ========================================================
         *  CoffeeScript
         * ========================================================*/

        coffee: {

            wp_theme: {
                expand: true,
                flatten: false,
                cwd: themeAssetPath + 'js/source',
                src: ['**/*.coffee'],
                dest: themeAssetPath + 'js/source',
                ext: '.js'
            }

        },

        /** ========================================================
         *  Minify Js
         * ========================================================*/
        uglify: {
            wp_theme: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    mangle: false,
                    beautify: false,
                    preserveComments: false
                },
                files: [{
                    cwd: themeAssetPath + 'js/source',
                    src: ['**/*.js', '!**/*.min.js'],
                    expand: true,
                    flatten: true,
                    dest: themeAssetPath + 'js/build',
                    ext: '.min.js'
                }]
            }
        },

        /** ========================================================
         * Compile SASS -> CSS
         ========================================================= */

        sass: {
            wp_theme: {
                files: [{
                    cwd: themeAssetPath + 'css/source',
                    src: ['*.scss'],
                    expand: true,
                    flatten: true,
                    dest: themeAssetPath + 'css/build',
                    ext: '.css'
                }]
            }
        },

        /** ========================================================
         * Compile Less -> CSS
         ========================================================= */
        less: {
            wp_theme: {
                options: {
                    yuicompress: true,
                    optimization: false,
                    ieCompat: true
                },
                files: [{
                    cwd: themeAssetPath + 'css/source',
                    src: ['*.less'],
                    expand: true,
                    flatten: false,
                    dest: themeAssetPath + 'css/build',
                    ext: '.min.css'
                }]
            }
        },
        /** ========================================================
         * debug stripper
         ========================================================= */
        strip: {
            wp_theme: {
                files: [{
                    src: [themeAssetPath + 'build/*.js', '!'+ themeAssetPath +'build/*.min.js'],
                    expand: true,
                    flatten: false,
                    ext: '.min.js'
                }],
                options: {
                    nodes: ['console.log', 'debug']
                }
            }
        },
        /** ========================================================
         * Css minifier
         ========================================================= */
        cssmin: {
            wp_theme: {
                files: [{
                    expand: true,
                    src: [themeAssetPath + 'build/**/*.css', '!'+ themeAssetPath +'build/**/*.min.css'],
                    ext: '.min.css'
                }]
            }

        },

        /** ========================================================
         * Watcher
         ========================================================= */
        watch: {
            scripts_and_styles: {
                files: [
                    themeAssetPath + '**/*.less',
                    themeAssetPath + '**/*.scss',
                    themeAssetPath + '**/*.js',
                    themeAssetPath + '**/*.coffee',
                    'public_html/bower_components/**/*',
                    'src/**/*.*',
                    '!'+ themeAssetPath +'**/*.min.js',
                ],
                tasks: [
                    'coffee:wp_theme',
                    'uglify:wp_theme',
                    'less:wp_theme',
                    'sass:wp_theme',
                    'strip:wp_theme',
                    'cssmin:wp_theme',
                ],
                options: {
                    livereload: 35730
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);


    // watcher
    grunt.registerTask(
        'watcher', ['watch:scripts_and_styles']
    );

    grunt.registerTask(
        'default', [
            'coffee:wp_theme',
            'uglify:wp_theme',
            'less:wp_theme',
            'sass:wp_theme',
            'cssmin:wp_theme',
        ]
    );

    // production tasks
    grunt.registerTask(
        'production', [
            'coffee:wp_theme',
            'uglify:wp_theme',
            'less:wp_theme',
            'sass:wp_theme',
            'strip:wp_theme',
            'cssmin:wp_theme',
        ]
    );
};