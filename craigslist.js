var path = require('path');
var express = require('express');
var app = express();
var craigslist = require('node-craigslist')
var session = require('express-session');


const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;


app.use(session({
    secret: 'craig',
    resave: false,
    saveUninitialized: true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public')));

app.use(logRequest);
app.post('/getFilter', handleFilter);

app.listen(app.get('port'), function() {
    console.log('Craiglist Scanner is running on port', app.get('port'));
});

function handleFilter(request, response) {

    var result = {success: false}
    var filter = request.body.filter;
    var city = request.body.city;

    console.log("Searching for " + filter + " in " + city);

    if (city != "") {
        request.session.city = city;
        request.session.filter = filter;
        result = {success: true};

        var
         client = new craigslist.Client({
            }),
            options = {
                city: city,
                category: filter
            };

         client
          .search(options)
          .then((listings) => {
             response.json(listings);
             console.log("Success in finding results");
             result = {success: true};
          })
          .catch((err) => {
             console.error(err);
          });

    } else {
        console.log("Error in params: " + city + ", " + filter);
    }
}

function logRequest(request, response, next) {
    console.log("Recieved a request for: " + request.url);
    next();
}
