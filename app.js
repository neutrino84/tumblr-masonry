var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express();

app.configure(function() {
    app.set('port', 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.set('layout', 'layout');

    //app.enable('view cache');

    app.engine('html', require('hogan-express'));

    app.use(express.favicon());
    app.use(express.logger('tiny'));
    app.use(app.router);
    app.use(express.static(
        path.join(__dirname, 'public')
    ));

    //app.use(function(err, req, res, next) {
    //    console.log(err.stack);
    //    next(err);
    //});
    //app.use(function(err, req, res, next) {
    //    res.render('index', {
    //        message: err
    //    });
    //});
});

//app.configure('development', function(){
//    app.use(express.errorHandler());
//});

app.get('/', function(req, res){
    res.render('index', {
        tags : [
            { id : 'animals', name : 'Animals'},
            { id : 'architecture', name : 'Architecture'},
            { id : 'art', name : 'Art'},
            { id : 'black-and-white', name : 'Black and White'},
            { id : 'cars', name : 'Cars'},
            { id : 'celebs', name : 'Celebrity'},
            { id : 'design', name : 'Design'},
            { id : 'diy', name : 'DIY'},
            { id : 'fashion', name : 'Fashion'},
            { id : 'film', name : 'Film'},
            { id : 'gif', name : 'GIF'},
            { id : 'gaming', name : 'Gaming'},
            { id : 'illustration', name : 'Illustration'},
            { id : 'interiors', name : 'Interiors'},
            { id : 'landscape', name : 'Landscape'},
            { id : 'lol', name : 'Lol'},
            { id : 'makeup', name : 'Makeup'},
            { id : 'menswear', name : 'Menswear'},
            { id : 'music', name : 'Music'},
            { id : 'poetry', name : 'Poetry'},
            { id : 'science', name : 'Science'},
            { id : 'sports', name : 'Sports'},
            { id : 'tattoos', name : 'Tattoos'},
            { id : 'television', name : 'Television'},
            { id : 'typography', name : 'Typography'},
            { id : 'vintage', name : 'Vintage'}
        ]
    });
});

http.createServer(app)
    .listen(app.get('port'), function() {
        console.log("Express server listening on port " + app.get('port'));
    });