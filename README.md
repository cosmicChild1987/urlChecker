urlChecker
==========

Checks a given url, and returns an object containing the response time from the url

Usage
=====
var urlChecker = require('alanchurley-url-checker');
urlChecker.checkUrl(urlDomain, port, path, callback);

Where the urlDomain and path are strings, port is a integer, and callback is a function


Response
========

Response will be in the following format

{
    status: x,
    time: y
}

Status will either be 1 for a valid request, or 0 for an error

time is the time in millseconds that the request took, if the status is 0, this will also be 0