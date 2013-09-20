
define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var PostModel =
            Backbone.Model.extend({
                url: '/post'
            });
    return PostModel;
});
