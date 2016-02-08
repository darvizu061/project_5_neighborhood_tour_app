                /* ======= Model ======= */
//city location
var map;
var markers = ko.observableArray();
var locations =[{
    title: "Statue of Liberty",
    location: {lat: 40.689249, lng: -74.044500}
},{
    title: "Grand Central Terminal",
    location: {lat: 40.752726, lng: -73.977229}
},{
    title: "Rockefeller Center",
    location: {lat: 40.758740, lng: -73.978674}
},{
    title: "Times Square",
    location: {lat: 40.759011, lng: -73.984472}
},{
    title: "Madison Square Garden",
    location: {lat: 40.750506, lng: -73.993394}
}
];
                    /* ======= ViewModel ======= */
var ViewModel = function(){
    var self = this;
    this.siteList = ko.observableArray([]);
    this.setAllSites = function(){
        locations.forEach(function(site){
            //push locations(site) to list view(this.siteList) 
            self.siteList.push(site);
        });
    };
    this.setAllMarkers = function(){
        for(var x in markers()){
            markers()[x].setMap(map);
        }
    }; 
    this.removeMarker = function(x){
        markers()[x].setMap(null);
    };
    //function when user clicks on list item  
    this.setCurrentMarker = function(clickedSite){
        if(self.siteList().length > 1){
            self.siteList.removeAll();
            self.siteList.push(clickedSite);
            //update marker 
            for(var x in markers()){
                if(!(markers()[x].title == clickedSite.title)){
                    self.removeMarker(x);
                }
            }
        } else {
            self.siteList.removeAll();
            self.setAllSites();
            self.setAllMarkers();
        }
    };
    
    
    // Sets the map on all markers in the array.
    this.query = ko.observable('');
    this.search = function(value){
        // remove all the current sites and markers, which removes them from the view
        self.siteList.removeAll();
        
        for(var x in locations) {
            //update list 
            if(locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.siteList.push(locations[x]);
            }
            //remove markers that aren't being searched for 
            if(!(locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0)) {
                self.removeMarker(x);
            }
            //redisplay markers that were previously removed 
            if(locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                markers()[x].setMap(map);
            }
        }
        
        
        
    };
    this.query.subscribe(this.search);
    self.setAllSites();
};


/*!
 * Initializing Google Map 
 * centered on New York city 
 * with ALL markers displaying on app load request. 
 */
 

function initMap() {
    //set map equal to NYC location 
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.768582, lng: -73.980560},
        map: map,
        zoom: 12
    });
    
    // put markers on map 
    locations.forEach(function(site){
        var marker = new google.maps.Marker({
            position: site.location,
            map: map,
            title: site.title
        });
        markers.push(marker);
    });
    
    
}
ko.applyBindings(new ViewModel())