function getFilter() {
    var filter = $("#filter").val();
    var city = $("#city").val();

    var params = {
        filter: filter,
        city: city
    };

    $.post("/getFilter", params, function(result) {
        if (result.success) {
            $("#status").text("Successfully retrieved filter");
        } else {
            $("#status").text("Error retrieving filter");
        }
        for(listing in result){
            $("#listings").append("Title of listing is: " + result[listing].title + '<br/>' + "<a href='" + result[listing].link + "'>Link</a><br/><br/>");
        }
    });
}