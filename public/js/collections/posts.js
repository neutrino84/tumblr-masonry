
define([
    'underscore',
    'backbone',
    'models/post'
], function(_, Backbone, PostModel) {
    var PostsCollection =
            Backbone.Collection.extend({
                model: PostModel,

                //initialize: function() {
                //    this.options = arguments[1];
                //},

                parse: function(response) {
                    if(response['response']['posts'])
                        return response['response'][
                            'posts'
                        ];
                    else return response[
                        'response'
                    ];
                }
            });
    return PostsCollection;
});
