
/*

usage of router
var router = require('./router');
var forumUrls = require('./forum').urls;
var home = require('./pages').home;

urls = [
    ['^/$', home],
    ['^/forum/.*', router.include(forumUrls)]
]

*/

var sys = require('sys')
    , parseURL = require('url').parse;


var error  =function(res){
	res.writeHead(404);
    res.end("<h1>"+res.url+"</h1>"+'404');
};
var route = function(req, res, urls, passed_args){
    for (var i=0;i<urls.length;i++){

        var param = parseURL(req.url,true);
        var args = new RegExp(urls[i][0]).exec(param.pathname);

        if (args !== null){
            args.shift();
            args.unshift(req, res,param);
            urls[i][1].apply(this, args);
            return true;
        }
    }
    return error(res);
};

var include = function(urls){
    return function(req, res){
        route(req, res, urls, Array.prototype.slice.call(arguments, 2));
    };
};


exports.route = route;
exports.include = include;

