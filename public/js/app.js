
define([
    'jquery',
    'underscore',
    'backbone',
    'views/posts'
], function($, _, Backbone, PostsView) {
    return {
        initialize: function() {
            var self = this,
                AppRouter = Backbone.Router.extend({
                    routes: {
                        "posts/:id": "posts",
                        "tags/:id": "tags",
                        "*path": "home"
                    }
                });

            var view,
                router = new AppRouter();
                router.on("route:home", function() {
                    view =
                        new PostsView({
                            id: 'hardcore',
                            type: 'user'
                        });
                });
                router.on("route:posts", function(id) {
                    view =
                        new PostsView({
                            id: id,
                            type: 'user'
                        });
                });
                router.on("route:tags", function(tag) {
                    view =
                        new PostsView({
                            tag: tag,
                            type: 'tags'
                        });
                });

            $(window)
                .click(function(event) {
                    var target = event.target;
                    if(target.tagName === 'DIV' &&
                            target.className == 'tags')
                        return;
                    else $('#menu ul.tags').removeClass(
                        'visible'
                    );
                });

            $('#menu div.tags')
                .click(function() {
                    $('#menu ul.tags').addClass(
                        'visible'
                    );
                });

            $('#menu ul.tags')
                .click(function() {
                    $('#menu ul.tags').removeClass(
                        'visible'
                    );
                });

            $('#content')
                .isotope({
                    itemSelector : '.item',
                    animationEngine : 'css',
                    layoutMode : 'masonry',
                    masonry : {
                        columnWidth : 254
                    }
                });

            $(document)
                .scroll(function() {
                    if(self.timeout == undefined)
                        self.timeout =
                            setTimeout(function() {
                                if(view && view.ready())
                                    view.render();
                                delete self.timeout;
                            }, 1000);
                });

            Backbone.history.start();
        }
    };
});
