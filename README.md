#  NEIGHBORHOOD MAP PROJECT README

## About 
This repo is a web app showcasing some of New York City's popular tourist destinations. It uses 3 API's to deliver overall content: Google Map's API, Flickr's API, Wikipedia's API. In additon to various api's, it uses knockoutjs and bootstrap for rendering and manipulating the view. 

**Read about further api and file details below.**
## Getting Familiarized  
Throughout the repository you will find 3 folders(`lib, js and css`) and file `index.html`.

**To view full project please run index.html.**

* **index.html** - contains front-end web app skeleton. It's important to note that skeleton is constructed via Bootstrap framework to ensure responsive mobile-first display. 
* **css** - contains `main.css` which holds all CSS for the main application. 
* **lib** - contains Bootstrap and Knockout libraries which are called in `index.html`. 
* **js** - contains `app.js` where main application's javascript lives and is minified to `app.min.js` for `index.html` to use.

## About the api's 

As previously mentioned, the three api's used are from google maps, flickr and wikipedia all used to for distinct purposes. Google maps is used for map and marker drawing, flickr ajax call retrives photos of locations and wikipedia ajax call retrives exert from the wikipedia page of the location. 

### PERSONAL USE & COPYRIGHT 

No copyright of this project is currently in place and is open to all to use and improve. **However please note that if you intend to use project for personal use the google api key (present in index.html) and the flickr api kep (present in js/app.js and js/app.min.js) must be changed**. The wikipedia api current requires no Authentication Token so none is present in this repo.  


