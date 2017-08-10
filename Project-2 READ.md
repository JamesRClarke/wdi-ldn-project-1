## InfoGram

#### Installation

To run this code you will need to:

- Download or clone the repo
- In your command line run `yarn` and that will isntall evrything needed to be able run this code
- From the directory just run `gulp` and it should direct you to the browser, with InfoGram.

-
### The Project 

This project was to build a fully RESTful application, which also included:

- regular login/register
- image upload using Amazon Web Services (s3)
- oAuth login
- use of API's
- proxy requests

The app allows a user to upload an image of a location, preferably a landmark of some sort, e.g. Eifel Tower, Mt Snowdon, Table Mountain. Using the Google Vision Api this it will take the image uploaded as a post (like Instagram) and then give back information about the location wihtout the user inputting any information.

This includes the location of the location on Google Maps which will be marked, and then using the Google Places API users can find nearby places to the location e.g Food, Transport links.

A simple idea, but one which can be built on a lot.

-
### Software and Languages

Here is a list of the software and languages used in the project:

- HTML 5
- SCSS 
- JavaScript ES6
- jQuery 3.10
- Gulp
- NPM
- Git & GitHub
- Express
- Express-Ejs-Layouts
- node.js
- Yarn
- Bulma Framework
- AJAX
- JSON

-
### Obstacles 

An obstacle which I managed to overcome was, the Google Vision API. The API is brilliant although it only worked how I wanted it to 95% of the time, in that, it sometimes was unable to recognise the location, so I had to get more general data and pass that into Google Maps API using their geocoding to identify the lat and lng.

Another obstacle was setting up the Google Places API. I set up this API using front-end, for it to not work, which was my own mistake. So I made a proxy request for this in which I didn't account time for but got it up and running through proxy reqeust.

-
### Enhancement and Development

I have compiled a list of advancements I would like to add to my project, these were not worked on due to either timing or simply not knowing how to:

- Using the TripAdvisor API, replacing Google Places API
- Make it fully responsive and have improve the UX for mobile users (image uploading)
- When clicking on marker on the map of nearby places gather more information on each place, having a box of content with links and reviews
- Make better use of the API's to display more information on the location.
