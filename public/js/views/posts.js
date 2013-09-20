
define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'collections/posts'
], function($, _, Backbone, Mustache, PostsCollection) {
    var PostsView =
            Backbone.View.extend({
                offset: 0,
                limit: 20,
                key:'Y4P5fknSUe3vHeLO0naO4BUuO0sPS2rTkLDx5A0b5n4jkHOICo',
                el: $('#content'),
                doc: $(document),

                initialize: function(options) {
                    var self = this;
                        self.doc.scrollTop(0);
                        self.$el.parent().addClass('loading');
                        self.$el.isotope('remove', self.$el.children(),
                            function() {
                                self.collection =
                                    new PostsCollection([], {
                                        url: function() {
                                            var key = self.key,
                                                limit = self.limit,
                                                offset = self.offset,
                                                blog = options['id'] + '.tumblr.com',
                                                tag = options['tag'];
                                            switch(options['type']) {
                                                case 'tags':
                                                    return 'http://api.tumblr.com/v2/tagged' +
                                                        '?api_key=' + key +
                                                        '&tag=' + tag +
                                                        '&limit=' + limit +
                                                        '&before=' + (offset ? offset : new Date().getTime()) +
                                                        '&filter=text';
                                                default:
                                                    return 'http://api.tumblr.com/v2/blog/' + blog + '/posts/photo' +
                                                        '?api_key=' + key +
                                                        '&limit=' + limit +
                                                        '&offset=' + (offset * self.limit) +
                                                        '&filter=text';
                                            }
                                        }
                                    });
                                self.render();
                            }
                        );
                },

                ready: function() {
                    if(this.request)
                        switch(this.request.readyState) {
                            case 4: return true;
                            default: return false;
                        }
                    else return true;
                },

                render: function() {
                    var self = this,
                        space = ($(window).height() * 3) +
                            $(document).scrollTop(),
                        containerSpace = self.$el.height();
                    if(containerSpace < space)
                        this.request =
                            this.collection.fetch({
                                dataType: "jsonp",

                                success: function(res) {
                                    switch(self['options']['type']) {
                                        case 'tags':
                                            self.offset =
                                                self.collection.at(
                                                    self.collection.length - 1
                                                ).get('timestamp');
                                            break;
                                        default:
                                            self.offset++;
                                            break;
                                    }
                                    self._render();
                                },

                                error: function() {
                                    self.$el.html(
                                        'There was a problem trying to ' +
                                            'retrieve posts for ' + this.id + '.'
                                    );
                                }
                            });
                },

                _render: function() {
                    var self = this,
                        collection = this.collection,
                        posts = collection.toJSON(),
                        items = '';
                    for(var post in posts)
                        switch(posts[post]['type']) {
                            case 'photo' :
                                var photos = posts[post]['photos'];
                                for(var photo in photos) {
                                    var alternates = photos[photo]['alt_sizes'],
                                        alternate = [],
                                        select;
                                    for(var a in alternates)
                                        if(//alternates[a]['width'] == 100 ||
                                                alternates[a]['width'] == 250) {
                                            alternate.push(
                                                alternates[a]
                                            );
                                            break;
                                        } else continue;

                                    if(alternate.length > 0)
                                        select = alternate[Math.floor(
                                            Math.random() *
                                                alternate.length
                                        )];

                                    if(select)
                                        items +=
                                            Mustache.render(
                                                '<div class="item photo" style="' +
                                                        'width: {{width}}px; ' +
                                                        'height: {{height}}px; ' +
                                                        'background-image: url(\'{{src}}\');">' +
                                                    '<div class="head"></div>' +
                                                    '<div class="foot">' +
                                                        '<img src="{{avatar}}" alt="{{id}}" />' +
                                                        '<div class="name">' +
                                                            '<a href="#posts/{{name}}">{{name}}</a>' +
                                                        '</div>' +
                                                        '<div class="date">{{date}}</div>' +
                                                    '</div>' +
                                                '</div>', {
                                                    src: select['url'],
                                                    name: posts[post]['blog_name'],
                                                    date: (
                                                        function(string) {
                                                            var now = new Date(),
                                                                date = new Date(string),
                                                                difference = now.getTime() - date.getTime(),
                                                                seconds = Math.abs(difference) / 1000,
                                                                minutes = seconds / 60,
                                                                hours = minutes / 60,
                                                                days = hours / 24;
                                                            return seconds < 45 && Math.round(seconds) + ' seconds ago' ||
                                                                seconds < 90 && '1 minute ago' ||
                                                                minutes < 45 && Math.round(minutes) + ' minutes ago' ||
                                                                minutes < 90 && '1 hour ago' ||
                                                                hours < 24 && Math.round(hours) + ' hours ago' ||
                                                                hours < 36 && '1 day ago' ||
                                                                days < 30 && Math.round(days) + ' days ago';
                                                        }
                                                    )(posts[post]['date']),
                                                    avatar: (
                                                        function(post) {
                                                            return 'http://api.tumblr.com/v2/blog/' +
                                                                post['blog_name'] +
                                                                    '.tumblr.com/avatar';
                                                        }
                                                    )(posts[post]),
                                                    width:  (
                                                        function(width) {
                                                            switch(width) {
                                                                case 100: return 105;
                                                                case 250: return 230;
                                                            }
                                                        }
                                                    )(select['width']),
                                                    height: (
                                                        function(height) {
                                                            if(height >= 376)
                                                                return 376;
                                                            else if(height >= 326)
                                                                return 326;
                                                            else if(height >= 276)
                                                                return 276;
                                                            else if(height >= 226)
                                                                return 226;
                                                            else if(height >= 126)
                                                                return 126;
                                                            else if(height >= 126)
                                                                return 126;
                                                            else return 76;
                                                        }
                                                    )(select['height'])
                                                }
                                            );

                                    // no slideshow support
                                    break;
                                }
                                break;
                            default :
                                continue;
                        }

                    $('#content').isotope(
                        'insert', $(items),
                            function() {
                                self.render();
                                self.$el.parent()
                                    .removeClass('loading');
                            }
                    );
                }
            });
    return PostsView;
});
