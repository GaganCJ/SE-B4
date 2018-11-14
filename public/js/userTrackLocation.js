function getLocation() {
    if (navigator.geolocation) {
        document.getElementById('map').style.display = 'block';
        document.getElementById('dvDistance').style.display = 'block';
        navigator.geolocation.getCurrentPosition(initMap, showError);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
}

function initMap(e) {
    var directionsService = new google.maps.DirectionsService();
    var dropLocation = {lat: parseFloat(document.getElementById('latitude').innerHTML), lng: parseFloat(document.getElementById('longitude').innerHTML)}
    var busMarker = {lat: 12.908030784898909,lng: 77.56654500961304};
    var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(dropLocation.lat, dropLocation.lng),
        zoom: 15,
        disableDefaultUI: true
    });
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    var request = {
        origin: dropLocation,
        destination: busMarker,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request,function(response, status){
        if(status == google.maps.DirectionsStatus.OK){
            directionsDisplay.setDirections(response);
        }
    });
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins:[dropLocation],
        destinations: [busMarker],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    },function(response, status){
        if(status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS"){
            var distance = response.rows[0].elements[0].distance.text;
            var duration = response.rows[0].elements[0].duration.text;
            var dvDistance = document.getElementById("dvDistance");
            dvDistance.innerHTML = "";
            dvDistance.innerHTML += "Distance: " + distance + "<br />";
            dvDistance.innerHTML += "Duration:" + duration;
        }else{
            alert("Unable to find the distance via road.");
        }
    });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
    }
}