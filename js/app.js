                /* ======= Model ======= */
//city location
var map;
var markers = ko.observableArray();
var locations =[{
        title: "Statue of Liberty",
        location: {lat: 40.689249, lng: -74.044500},
        pictures: []
    },{
        title: "Grand Central Terminal",
        location: {lat: 40.752726, lng: -73.977229},
        pictures: []
    },{
        title: "Rockefeller Center",
        location: {lat: 40.758740, lng: -73.978674},
        pictures: []
    },{
        title: "Times Square",
        location: {lat: 40.759011, lng: -73.984472},
        pictures: []
    },{
        title: "Madison Square Garden",
        location: {lat: 40.750506, lng: -73.993394},
        pictures: []
    },{
        title: "Empire State Building",
        location: {lat: 40.748441, lng: -73.985664},
        pictures: []
    },{
        title:"Metropolitan Museum of Art",
        location: {lat: 40.779187, lng: -73.963535},
        pictures: []
    },{
        title: "Bryant Park",
        location: {lat: 40.753597, lng: -73.983233},
        pictures: []
    },{
        title: "World Trade Center site",
        location: {lat: 40.711801, lng: -74.013120},
        pictures: []
    },{
        title: "Frick Collection",
        location: {lat: 40.771181, lng: -73.967350},
        pictures: []
    }
];
                    /* ======= ViewModel ======= */
var ViewModel = function(){
    var self = this;
    
    //controls list and pictures that are dislayed in HTML 
    this.siteList = ko.observableArray();
    this.sitePics = ko.observableArray();
    
    this.initView = function(){
        //declare basic var's
        var flickerApi, data, imgUrl, tag;
        locations.forEach(function(site){
            //set tag as obj title without spaces
            tag = site.title.replace(/\s/g, '');
            flickerApi = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=8464c6c6332cf769ce0a9f0d5b55fd91&sort=interestingness-asc&tags="+ tag +"&per_page=4&page=1&format=json&nojsoncallback=1";
            
            //call api and get photos 
            $.getJSON(flickerApi, function(reply){
                data = reply.photos.photo;
                data.forEach(function(img){
                    imgUrl = 'https://farm' + img.farm + '.static.flickr.com/' + img.server + '/' + img.id + '_' + img.secret + '.jpg';
                    site.pictures.push(imgUrl);
                    
                });
            });
            self.siteList.push(site);
        });
    };

    //resets list to original full list 
    this.restoreList = function(){
        locations.forEach(function(site){
            
            self.siteList.push(site);
        });
    };
    //resets Markers to ALL display
    this.restoreMarkers = function(){
        for(var x in markers()){
            markers()[x].setMap(map);
        }
    }; 
    //does not remove marker from array rather changes it's setMap property to not display
    this.removeMarker = function(x){
        markers()[x].setMap(null);
    };
    //add event listener to all markers
    // this.addEventListener = function(){
    //     markers().forEach(function(marker){
    //         marker.addListener('click', function(){
    //         console.log(marker.title);
    //         });
    //     });
    //     console.log("it's working");
    // };
    
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
            //update pictures 
            clickedSite.pictures.forEach(function(link){
                self.sitePics.push(link);
            });
            
        //if user reclicks on List item the whole list resets to display all sites on list
        } else {
            self.siteList.removeAll(); //removes them first to avoid making duplicates 
            self.sitePics.removeAll();
            
            self.restoreList();
            self.restoreMarkers();
        }
    };
    
    this.drawMap = function(){
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
            
            marker.addListener('click', function(){
                console.log(marker.title);
            });
            markers.push(marker);
        });
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
    
    self.initView();
    self.drawMap();
};



/*!
 * Initializing Google Map 
 * centered on New York city 
 * with ALL markers displaying on app load request. 
 */
 
ko.applyBindings(new ViewModel())