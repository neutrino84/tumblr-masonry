
require.config({
    paths: {
        jquery: 'libs/jquery',
        isotope: 'libs/isotope',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        mustache: 'libs/mustache'
    },
    shim: {
        //'isotope': ['jquery'],
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'mustache': {
            exports: 'Mustache'
        }
    }
});

require(['app', 'jquery', 'isotope'], function(App) {
    App.initialize();
});
