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
            $("#listings").append("Title of listing is: " + result[listing].title + '<br/>' + "<a href='" + result[listing].url + "'>Link</a><br/><br/>");
        }
    });
}