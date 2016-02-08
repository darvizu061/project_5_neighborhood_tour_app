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
    //controls list that is dislayed in HTML 
    this.siteList = ko.observableArray([]);
    //resets list to original full list 
    this.setAllSites = function(){
        locations.forEach(function(site){
            //push locations(site) to list view(this.siteList) 
            self.siteList.push(site);
        });
    };
    //resets Markers to ALL display
    this.setAllMarkers = function(){
        for(var x in markers()){
            markers()[x].setMap(map);
        }
    }; 
    //does not permanently delete marker rather changes it's setMap to not display making it invisible 
    this.removeMarker = function(x){
        markers()[x].setMap(null);
    };
    //function when user clicks on list item  
    this.setCurrentMarker = function(clickedSite){
        //checks to see if multiple items are in list 
        if(self.siteList().length > 1){
            //removes all other list item 
            self.siteList.removeAll();
            self.siteList.push(clickedSite);
            //update marker 
            for(var x in markers()){
                if(!(markers()[x].title == clickedSite.title)){
                    self.removeMarker(x);
                }
            }
        //if user reclicks on List item the whole list resets to display all sites on list
        } else {
            self.siteList.removeAll();
            self.setAllSites();
            self.setAllMarkers();
        }
    };
    
    
    // query used to bind search function with subscribe ko functionality  
    this.query = ko.observable('');
    //search function 
    this.search = function(value){
        // remove all the current sites and markers, which removes them from the view
        self.siteList.removeAll();
        
        for(var x in locations) {
            //update list and markers as user types 
            if(locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.siteList.push(locations[x]);
                markers()[x].setMap(map);
            } else{
                //remove markers that aren't being searched for 
                self.removeMarker(x);
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
    
    // installing init markers on map 
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