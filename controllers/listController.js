const { Pool } = require('pg');
require('dotenv').config();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const db_url = process.env.DATABASE_URL;
const pool = new Pool({connectionString: db_url});


function addFavorite(title, link) {
    var sql = "INSERT INTO list (title, link) VALUES (title=$1::text, link=$2::text)";
    var params = [title, link];

    pool.query(sql, params, function(err, db_results){
        if (err) {
            throw err;
        } else {
            console.log("Inserted params to DB with values: ");
            console.log(params);

            var results = {
                success: true,
                list:db_results.rows
            };
        }
    });
}

function getFavoriteList(request, response) {
    var sql = "SELECT * FROM list";

    pool.query(sql, function(err, db_results){
        if (err) {
            throw err;
        } else {
            //success
            console.log("Back from the DB with: ");
            console.log(db_results);
            
            // for(listings in db_results){
            //     $("#favorites").append("Title of listing is: " + db_results.rows[listing].title + '<br/>' + "<a href='" + db_results.rows[listing].url +"'>Link</a><br/>");
            // }

            var results = {
                success: true,
                list:db_results.rows
            };
            response.json(results);
        }
    });
}

module.exports = {
    addFavorite: addFavorite,
    getFavoriteList: getFavoriteList
};