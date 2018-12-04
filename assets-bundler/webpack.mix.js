/**
 * Assets bundler
 */
const mix                = require('laravel-mix');
const path               = require('path');
const atimport           = require('postcss-import');
const mixins             = require('postcss-mixins');
const custommedia        = require('postcss-custom-media');
const colorfunction      = require('postcss-color-function');
const nesting            = require('postcss-nesting');
const nested             = require('postcss-nested');
const customselector     = require('postcss-custom-selectors');
const atroot             = require('postcss-atroot');
const atvariables        = require('postcss-at-rules-variables');
const atfor              = require('postcss-for');
const ateach             = require('postcss-each');
const atif               = require('postcss-conditionals');
const propertylookup     = require('postcss-property-lookup');
const extend             = require('postcss-extend');
const selectormatches    = require('postcss-selector-matches');
const selectornot        = require('postcss-selector-not');
const cssvariable        = require('postcss-css-variables');
const inlinesvg          = require('postcss-inline-svg');
const assets             = require('postcss-assets');
const calc               = require('postcss-calc');
const percentage         = require('postcss-percentage');
const mqpacker           = require('css-mqpacker');
const autoprefixer       = require('autoprefixer');

const rimraf             = require('rimraf');
const StyleLintPlugin    = require('stylelint-webpack-plugin');
const SVGSpritemap       = require('svg-spritemap-webpack-plugin');

/**
 * Path
 * @type {[type]}
 */
const mainPath           = '../app/';
const staticPath         = mainPath + 'static/';
const assetsPath         = mainPath + 'assets-bundler/';

const devtool              = 'inline-source-map';

/**
 * Custom webpack configuration
 * @type {Object}
 */
let webpack = {
    module: {
        rules: [
            /**
             * Javascript custom loader
             */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.css'],
        alias: {}
    },

    plugins: [
        /**
         * Stylelint
         */
        new StyleLintPlugin(
            {
                configFile: '.stylelintrc',
                quiet: false,
                files: ['stylesheets/**/*.css']
            }
        ),

        /**
         * Sprite svg
         */
        new SVGSpritemap(
            {
                src: 'svg/*.svg',
                filename: mainPath + 'assets/svg/sprite.svg',
                prefix: '',
                chunk: mainPath + 'assets/svg/sprite',
                deleteChunk: false,
                gutter: 2,
                svgo: {
                    removeViewBox: false,
                    convertStyleToAttrs: true,
                    removeAttrs: true,
                    removeTitle: true,
                    convertTransform: true
                }
            }
        )
    ],

    devtool: devtool,

    stats: {
        errors: false,
        warnings: false,
        chunks: false,
        errorDetails: false,
        chunkModules: false
    }
};

/**
 * Custom mix options
 * @type {Object}
 */
let options = {
    processCssUrls: false,
    clearConsole: false,
    uglify: {
        sourceMap: true,
        parallel: true,
        uglifyOptions: {
            safari10: true,
            compress: {
                warnings: false,
                drop_console: process.env.NODE_ENV === 'production'
            },
            output: { comments: false },
            mangle: { safari10: true }
        }
    },
    postCss: [
        atimport,
        customselector,
        custommedia,
        colorfunction,
        mixins,
        atvariables,
        atfor,
        ateach,
        atif,
        atroot,
        nested,
        nesting,
        cssvariable,
        extend,
        assets({ loadPaths: [path.resolve(assetsPath + 'images/')] }),
        inlinesvg({ path: path.resolve(assetsPath + 'svg/') }),
        propertylookup,
        selectormatches,
        selectornot,
        mqpacker({ sort: true }),
        percentage(
            {
                precision: 2,
                floor: true
            }
        ),
        calc({ precision: 5 })
    ]
};

/**
 * Clean directory
 */
rimraf(
    mainPath + '{assets/css/*, assets/js/*, assets/fonts/*, assets/svg/*, assets/img/*}',
    error => {
        if (error) {
            console.log('💥', '\t', 'Error removing older bundled assets', '\n');
            console.error(error);
        } else {
            console.log('🚿', '\t', 'Removing older bundled assets successfully');
        }
    }
);

/**
 * Process mix
 */
mix
    /**
     * Set public path
     */
    .setPublicPath(mainPath)

    /**
     * Override webpack config
     */
    .webpackConfig(webpack)

    /**
     * Override mix options
     */
    .options(options)

    /**
     * Process stylesheets
     */
    .postCss('stylesheets/entrypoint.css', 'assets/css/styles.css')

    /**
     * Process javascripts
     */
    .js('javascript/entrypoint.js', 'assets/js/app.js')

    /**
     * Copy
     */
    .copy('images/', mainPath + 'assets/img/')
    .copy('fonts/', mainPath + 'assets/fonts/')
    // .copy('svg/', mainPath + '/assets/svg/')

    /**
     * Sourcemap
     */
    .sourceMaps()

    /**
     * Browser sync
     */
    .browserSync({
        proxy: 'http://local.emeric.com',
        notify: false,
        reloadOnRestart: true,
        logPrefix: 'emeric',
        ghostMode: false,

        // wait a little ensure jekyll build is done
        reloadDelay: 1000,
        reloadDebounce: 1000,

        files: [ '**/*.css', '**/*.js', '**/*.html' ],
        watchEvents: ['add', 'change'],
        watchOptions: {
            awaitWriteFinish: true,
            ignoreInitial: true,
            // set static dir as current working dir
            // compilation result is appended in static
            cwd: '../static/',
            ignored: [
                'fonts/*',
                '*.map',
                'mix-manifest.json'
            ]
        }
    });

/**
 * Output infos
 */
console.log('-----------------------------------------------------------------------------------');
console.log('🚛', '\t', 'Build for: ', process.env.NODE_ENV.toUpperCase());
console.log('-----------------------------------------------------------------------------------\n');
mix;
