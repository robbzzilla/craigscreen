var jquery = require('jquery');
var path = require('path');
var express = require('express');
var app = express();
const router = express.Router();
var session = require('express-session');
var Nightmare = require('nightmare'),
    nightmare = Nightmare();


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

    var filter = "";
    var carsFilter = '.craigslist.org/search/cto?postedToday=1&auto_make_model=toyota';
    var computersFilter = '.craigslist.org/search/sys?postedToday=1';
    var compPartsFilter = '.craigslist.org/search/sop?postedToday=1';
    var electronicsFilter = '.craigslist.org/search/ele?postedToday=1';
    var toolsFilter = '.craigslist.org/search/tls?postedToday=1';


    console.log(request.body.filter);
    console.log(request.body.city);

    var condition = request.body.filter;
    var city = request.body.city;

    switch(condition) {
        case "1":
            filter = carsFilter;
            break;
        case "2":
            filter = computersFilter;
            break;
        case "3":
            filter = compPartsFilter;
            break;
        case "4":
            filter = electronicsFilter;
            break;
        case "5":
            filter = toolsFilter;
            break;
    }

    console.log("Switched filter to: " + filter);

    if (filter != "" && city != null) {
        request.session.city = city;
        request.session.filter = filter;
        result = {success: true};

        try {
            var url = 'http://' + city + filter;
    
            console.log("Requesting listing Craigslist @: " + url);
    
            nightmare.goto(url)
            
                .wait(2000)
                
                .evaluate(function() {
                    var listings = [];
    
                    $('.hdrlnk').each(function() {
                        item = {}
                        item["title"] = $(this).text()
                        item["link"] = $(this).attr("href")
                        listings.push(item)
                    })
    
                    return listings
                })
                .end()
                .then(function(result){
                    for(listing in result) {
                        console.log(result[listing].title)
                        console.log(result[listing].link)
                        console.log("\n")
                    }
                    response.json(result);
                    console.log(result);
                }) 

        } catch(e) {
            console.log("Error in try catch" + e);
            response.json(result);
        }

    } else {
        console.log("Error in params: " + city + ", " + filter);
    }
    
}

function logRequest(request, response, next) {
    console.log("Recieved a request for: " + request.url);
    next();
}
