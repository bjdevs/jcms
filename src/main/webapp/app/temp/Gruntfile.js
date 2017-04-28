// 已装过node.js环境
// 1.npm install -g grunt-cli
// 2.npm init // 已有package.json 不需要此步骤
// 3.npm install grunt --save-dev
// 4.npm install grunt-contrib-uglify grunt-contrib-concat grunt-contrib-cssmin grunt-contrib-jshint grunt-contrib-watch grunt-contrib-connect grunt-extjs-dependencies
// 5.grunt

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // 定义一个用于插入合并输出文件之间的字符
                separator: ';'
            },
            dist: {
                src: ['resources/extjs/expand/**/*.js'],//src文件夹下包括子文件夹下的所有文件
                dest: 'resources/extjs/ext-expand-debug.js'//合并文件在dist下名为built.js的文件
            }
        },
        cssmin: {
            css: {
                src: 'resources/css/admin-debug.css',//将之前的all.css
                dest: 'resources/css/admin.css'  //压缩
            }
        },
        extjs_dependencies: {
            dist: {
                options: {
                    rootDir: './',
                    src: [
                        //{ path: 'app/.idea', parse: false },
                        'app/'
                    ],
                    excludeClasses: ['Ext.*'],
                    resolveFrom: 'app/application-debug.js'
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            /*build: {
             src: 'resources/extjs/expand/expand-debug.js',//压缩源文件是之前合并的buildt.js文件
             dest: 'resources/extjs/expand/expand.js'//压缩文件为built.min.js
             }*/
            my_target: {
                files: {
                    'resources/extjs/ext-expand.js': ['resources/extjs/ext-expand-debug.js'],
                    '../application.js': ['<%= extjs_dependencies_dist %>']
                }
            }
        }


    });
    grunt.loadNpmTasks('grunt-contrib-uglify');//采用UglifyJS压缩js
    grunt.loadNpmTasks('grunt-contrib-concat');//js合并
    grunt.loadNpmTasks('grunt-contrib-cssmin');//css压缩合并
    grunt.loadNpmTasks('grunt-extjs-dependencies');

    grunt.registerTask('default', ['concat', 'extjs_dependencies', 'cssmin', 'uglify']);
};


