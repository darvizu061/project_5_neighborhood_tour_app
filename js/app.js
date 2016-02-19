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
    },{
        title: "Yankee Stadium",
        location: {lat: 40.828819, lng: -73.926569},
        pictures: []
    }
];
                    /* ======= ViewModel ======= */
var ViewModel = function(){
    var self = this;
    
    //controls list, pictures, and infowindows that are dislayed in HTML 
    this.siteList = ko.observableArray();
    this.sitePics = ko.observableArray();
    this.siteInfo = ko.observableArray();
    //set side list view 
    this.initListView = function(){
        locations.forEach(function(site){
            self.siteList.push(site);
        });
        // INITIALIZE
        self.getSitePhotos();
        self.getSiteExtract();
    };
    //get photo url's for locations using FLICKER API
    this.getSitePhotos = function(){
        var flickerApi, imgUrl, flickertag, data1;
        locations.forEach(function(site){
                                                       // ****FLICKER API**** 
            //set tag as obj title without spaces
            flickertag = site.title.replace(/\s/g, '');
            
            flickerApi = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=8464c6c6332cf769ce0a9f0d5b55fd91&sort=interestingness-asc&tags="+ flickertag +"&per_page=10&page=1&format=json&nojsoncallback=1";
            
            $.ajax({
                type: "GET",
                data: data1,
                url: flickerApi,
                success: function(data){
                    data1 = data.photos.photo;
                    data1.forEach(function(img){
                        imgUrl = 'https://farm' + img.farm + '.static.flickr.com/' + img.server + '/' + img.id + '_' + img.secret + '.jpg';
                        site.pictures.push(imgUrl);
                    });
                },
                error: function(){
                    alert("We're sorry but the Flickr API failed to download photos of "+site.title+" in New York City");
                }
            });
        });
    };
    //get wikipedia site extract for markers' infowindows
    this.getSiteExtract = function(){
        var wikiApi, wikitag, data1;
        
        locations.forEach(function(site){
                                                       // ****WIKIPEDIA API****
            //set tag as obj title without spaces
            wikitag = site.title.replace(/\s/g,'+');
            
            wikiApi = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles="+wikitag+"&exsentences=2&explaintext=1";
            //call api and get site extract from wikipedia  
            $.ajax({
                type: "GET",
                data: data1,
                url: wikiApi,
                contentType: 'text/plain',
                withCredentials: false,
                crossDomain: true,
                dataType: 'jsonp',
                timeout: 2000, //timeout is used to call error funtion since jsonp datatypes don't directly support error handlers 
                success: function(data){
                    data1 = data.query.pages[Object.keys(data.query.pages)[0]].extract;
                    
                    //create marker with infowindow as Data1
                    self.newInfoWindow(data1);
                    self.newMarker(site.location, site.title, site);
                    
                },
                error: function(){
                    alert("We're sorry but the WIKIPEDIA API failed to download extract of "+site.title+" in New York City");
                }
                
            });
        });
    };
    //resets list to original full list 
    this.restoreList = function(){
        locations.forEach(function(site){
            self.siteList.push(site);
        });
    };
    //changes it's setMap property to display
    this.restoreMarker = function(x){
        markers()[x].setMap(map);
    }; 
    //does not remove marker from array rather changes it's setMap property to not display
    this.removeMarker = function(x){
        markers()[x].setMap(null);
    };
    // toogle marker bounce animation 
    this.toggleAnimation = function(marker){
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    };
    //function when user clicks on list item  
    this.setCurrentMarker = function(clickedSite){
        //var x used for 'for loops'
        var x;
        //checks to see if multiple items are in list 
        if(self.siteList().length > 1){
            //removes all other list item 
            self.siteList.removeAll();
            self.siteList.push(clickedSite);
            
            //update markers 
            for(x in markers()){
                if(!(markers()[x].title == clickedSite.title)){
                    self.removeMarker(x);
                } else {
                    self.toggleAnimation(markers()[x]);
                    self.siteInfo()[x].open(map, markers()[x]);
                }
            }
            //update pictures 
            clickedSite.pictures.forEach(function(link){
                self.sitePics.push(link);
            });
            
        //if user reclicks on List item the whole list resets to display all sites on list
        } else {
            //for loop toogles animation off and restores markers 
            for(x in markers()){
                if(!(markers()[x].title == clickedSite.title)){
                    self.restoreMarker(x);
                } else {
                    self.toggleAnimation(markers()[x]);
                    self.siteInfo()[x].close(map, markers()[x]);
                }
            }
            
            self.siteList.removeAll(); //removes them first to avoid making duplicates 
            self.restoreList();
            
            self.sitePics.removeAll(); //remove images from screen
            
            
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
    //bind query to search function with knockoutjs
    this.query.subscribe(this.search);

    
    this.newInfoWindow = function(content){
        var infowindow = new google.maps.InfoWindow({
            content: content
        });
        self.siteInfo.push(infowindow);
    };
    this.newMarker = function(position, title, site){
        var marker = new google.maps.Marker({
            position: position,
            animation: google.maps.Animation.DROP,
            map: map,
            title: title
        });
        //binding setCurrentMarker function to marker click event
        marker.addListener('click', function(){
            self.setCurrentMarker(site);
            
        });
        markers.push(marker);
    };
    
    /*!
    * Initializing List and Google Map
    */
    self.initListView();
};
                                /* ======= GOOGLE MAP API ======= */
function initMap(){
    
    //set map equal to NYC location 
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.758740, lng: -73.978674},
        map: map,
        zoom: 11
    });
}
function mapsError(){
    alert("We're sorry but the Google Map failed to load");
}

ko.applyBindings(new ViewModel())