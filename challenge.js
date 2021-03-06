var areaName;
var lat;
var long;
var map;
var num=0;



function findAddress_Complete(result) {
     lat = result.results[0].geometry.location.lat;
     long = result.results[0].geometry.location.lng;
    areaName = result.results[0].address_components[1].short_name + "," +
               result.results[0].address_components[3].short_name;
    darkSky(lat, long);

}

function findAddress(city, state, address) {
  
    var addAddress  = "";
    if (address.length != 0) {
        addAddress = address.trim();
 }
    else if (city.length != 0 && state != 0) {
        addAddress = city.trim() + ", " + state;
 }
    else {
        return;

//get url for darksky
 }
    var pullGoogle = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addAddress + "&key=AIzaSyBYU-nRSm6HXOq470xg5b_A5bXOwz7rOh4";

    var request = {
        url: pullGoogle,
        success: findAddress_Complete
};

    $.ajax(request);
}

// look up address on click 
function buttonLookup_click() {
    var postcode = $("#address").val();
   findAddress("", "", postcode);

}
// this is the click event
$(function () {
    $("#buttonLookup").on("click", buttonLookup_click);

});

// get info from darksky

function darkSky(lat, long) {
    var darkSky = "https://api.darksky.net/forecast/60dfe781e615860cf1939b773279e5a6/" + lat + "," + long;
    var weather = {
        url: darkSky,
        dataType: "jsonp",
        success: darkSky_Complete
};

    $.ajax(weather);
}

// receive weather information 

function darkSky_Complete(result) {
    console.log("It is currently " + result.timezone + ".");

    var data = {
        time: 
         Date(result.currently.time * 1000),
        lrgTemp: Math.round((result.currently.temperature)) + "&deg",
        crntCond: (result.currently.summary),
        tempMin: Math.round((result.daily.data[0].temperatureMin)) + "&deg",
        rainChance: (result.daily.data[0].precipProbability),
        maxTemp: Math.round ((result.daily.data[0].temperatureMax)) + "&deg",
        minText: ("Min"),
        rainChancetext: ("Rain Chance"),
        maxText: ("Max"),
        icon:(result.currently.icon)
};

    cardChange2(data);
    pickCard(data);
}

// pulls the new lat and long from darksky. 


function initMap() {
    map = new google.maps.Map(document.getElementById('map'+ num), {
        center: { lat: +lat, lng: +long },
        zoom: 12
    });
    num++;
    var myLatLng = { lat: +lat, lng: +long };
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title:  'Location'

    });
    marker.setMap(map);

}



// show new card and gets the correct information

function cardChanges(data) {
    var forcastInfo = $("#forcastshow").html();

    forcastInfo = forcastInfo.replace("-city-", areaName);
    forcastInfo = forcastInfo.replace("-date,time-", data.time);
    forcastInfo = forcastInfo.replace("-lrgDegree-", data.lrgTemp);
    forcastInfo = forcastInfo.replace("-cond-", data.crntCond);
    forcastInfo = forcastInfo.replace("-minTemp-", data.tempMin);
    forcastInfo = forcastInfo.replace("-rain-", data.rainChance + "%");
    forcastInfo = forcastInfo.replace("-maxTemp", data.maxTemp);
    forcastInfo = forcastInfo.replace("-min-", data.minText);
    forcastInfo = forcastInfo.replace("-rainChances-", data.rainChancetext);
    forcastInfo = forcastInfo.replace("-max-", data.maxText);
    forcastInfo = forcastInfo.replace("-mapInfo-", data.icon);
    forcastInfo = forcastInfo.replace("-num-", num);
      return forcastInfo;
}
//puts information on card

function cardChange2(forcastInfo) {
    var html = cardChanges(forcastInfo);
    $('#forcastshow2').append(html);
    initMap();
}

function removeCard() {
    var elem = document.getElementById('infoCard');
    elem.parentNode.removeChild(elem);
    return false;
}

