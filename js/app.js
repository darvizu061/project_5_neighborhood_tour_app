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
    },{
        title: "Empire State Building",
        location: {lat: 40.748441, lng: -73.985664}
    },{
        title:"Metropolitan Museum of Art",
        location: {lat: 40.779187, lng: -73.963535}
    },{
        title: "Bryant Park",
        location: {lat: 40.753597, lng: -73.983233}
    },{
        title: "World Trade Center site",
        location: {lat: 40.711801, lng: -74.013120}
    },{
        title: "Frick Collection",
        location: {lat: 40.771181, lng: -73.967350}
    }
];
                    /* ======= ViewModel ======= */
var ViewModel = function(){
    var self = this;
    var latPlaceholder;
    var lngPlaceholder;
    //controls list and pictures that are dislayed in HTML 
    this.siteList = ko.observableArray();
    this.sitePics = ko.observableArray();
    
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
    //does not remove marker from array rather changes it's setMap property to not display
    this.removeMarker = function(x){
        markers()[x].setMap(null);
    };
    this.setPictures = function(){
        var flickerApi = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=8464c6c6332cf769ce0a9f0d5b55fd91&sort=interestingness-asc&accuracy=15&lat="+latPlaceholder+"&lon="+lngPlaceholder+"&per_page=4&page=1&format=json&nojsoncallback=1";
        var data;
        var imgUrl;
        $.getJSON(flickerApi, function(reply){
            data = reply.photos.photo;
            data.forEach(function(img){
                imgUrl = 'https://farm' + img.farm + '.static.flickr.com/' + img.server + '/' + img.id + '_' + img.secret + '.jpg';
                self.sitePics.push(imgUrl);
            });
        });
        
        
    };
    //function when user clicks on list item  
    this.setCurrentMarker = function(clickedSite){
        //checks to see if multiple items are in list 
        if(self.siteList().length > 1){
            //removes all other list item 
            self.siteList.removeAll();
            self.siteList.push(clickedSite);
            //update markers 
            for(var x in markers()){
                if(!(markers()[x].title == clickedSite.title)){
                    self.removeMarker(x);
                } 
            
            }
            latPlaceholder = clickedSite.location.lat;
            lngPlaceholder = clickedSite.location.lng;
            self.setPictures();
            
        //if user reclicks on List item the whole list resets to display all sites on list
        } else {
            self.siteList.removeAll(); //removes them first to avoid making duplicates 
            self.sitePics.removeAll(); //removes photos of site
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