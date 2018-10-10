
var placingSpotting = false;
function initMap() {
    console.log("Loading map...");
    //Center in location of wellington
    var wellington = { lat: -41.2871926, lng: 174.7762 };
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 15, center: wellington }
    );
    console.log("Loaded map");

    //loading previously added spottings
    loadSpottings(map);
    map.addListener('click', function (e) {
        if (placingSpotting) {
            placeMarkerAndPanTo(e.latLng, map);
        }
    })

    // var message = prompt("Care to leave a message :3");//TODO add to firebase
}

loadSpottings = async(map) => {
    const fireBaseSpottings = await fetch('https://gitsearch-ff7bc.firebaseio.com/spottings.json?print=pretty').then(res => res.json())
    const keys = await Object.keys(fireBaseSpottings);
    const spottings = await keys.map(key => ({
        lat: fireBaseSpottings[key].lat,
        lng: fireBaseSpottings[key].lng
    }));
    //now load into map
    await spottings.forEach((e)=> {
       console.log(e);
       new google.maps.Marker({
            position: e,
            map: map
        });
    })
}

function placeMarkerAndPanTo(latLng, map) {
    addMarkerToCollection(latLng);
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    map.panTo(latLng);
}


//FIREBASE STUFF

addMarkerToCollection = async (latLng) => {
    console.log("adding to firebase...")
    const response = await fetch("https://gitsearch-ff7bc.firebaseio.com/spottings.json", {
        method: "POST",
        body: JSON.stringify(latLng)
    }).catch(err => console.log(err));
    console.log("added")
}