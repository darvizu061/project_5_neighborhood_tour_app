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
        //draw google map
        self.drawMap();
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
    
                /* ======= GOOGLE MAP API ======= */

    //draw google map  
    this.drawMap = function(){
        //set map equal to NYC location 
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.768582, lng: -73.980560},
            map: map,
            zoom: 12
        });
        
        // installing original markers on map 
        locations.forEach(function(site){
            var marker = new google.maps.Marker({
                position: site.location,
                animation: google.maps.Animation.DROP,
                map: map,
                title: site.title
            });
            
            //binding setCurrentMarker function to marker click event
            marker.addListener('click', function(){
                self.setCurrentMarker(site);
                
            });
            markers.push(marker);
        });
        
    };
    
    
    /*!
    * Initializing List and Google Map
    */
    self.initView();
};




ko.applyBindings(new ViewModel())