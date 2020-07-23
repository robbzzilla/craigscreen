function getFilter() {
    var filter = $("#filter").val();
    var city = $("#city").val();

    console.log("Getting filter information...")

    var params = {
        filter: filter,
        city: city
    };

    $.post("/getFilter", params, function(result) {
        $("#listings").empty();

        listing = parseInt($("#items").val(), 10);
        for(listing; listing > 0; listing--){
            _title = result[listing].title;
            _url = result[listing].url;
            $("#listings").append("<input type='hidden' id='list_title' value='" + _title + "'>Title: " + _title + '</input><br/>' + "<a href='" + _url + 
            "'>Link</a><br/><button onclick='addFavorite();'>Favorite</button><br/><br/>");
        }
    });
}

function getFavoriteList() {
    $.get("/getFavoriteList", function(result) {

        for(listing in result) {
            $("#favorites").append("Title of listing is: " + _title + '<br/>' + "<a href='" + _url + "'>Link</a><br/><br/>");
        }
    })
}

function addFavorite() {
    var title = $("#list_title").val();
    var url = "blank";

    var params = {
        title: title,
        url: url
    };

    $.get("/addFavorite", params, function(result) {
        console.log("Adding item to favorites...");
    });
}