# javascript-api-test
Test for Front end developer candidates. When you start the test, create a branch off of master that you will name after you and when you are done create a pull request assigned to Clara Grant or James Baker. Good luck!

# Story
The quarterly review of the company is upon us and we need to find beers for everyone! There's 30 people expected to go and we want a good variety of beers but also a good amount of pale ales.

# The test
Using the Punk API create a single page application where people can search beers by name or description and display all the beers with their names, images and taglines. The single page application should allow the user to add a beer they like to a general basket where all the employee of the company can see/add to. There will be a limit of 10 different types of beers and a total limit of 60 beers overall in the basket. You have a 2 hour limit to do this test. We don't expect you to finish (although if you do than yay) we just want to test your way of thinking and how you go about solving this problem.

# The tools
You can use any tools you are comfortable with to code this application (ReactJS, Vue, Angular...) and you must use the Punk API (https://punkapi.com/documentation/v2) to get the data from. The API has a request limit of 3600 per hour, so you may want to save the json response to work with during the test. You are welcome to add any documentation to your code especially commands for us to test it.


# How to run app locally

On the command line in this directory run:
```
  npm ci
  npm run dev
```

Served locally at: http://localhost:8080/

# Currently hosted on Firebase
https://cheers-to-beers.firebaseapp.com/

NOTE: This will replace what is currently being served on Firebase
To update build:
```
  npm ci
  npm run build
  firebase deploy
```


# Objectives met (some are outside of test requirements) on the Friday, the day the test was assigned
* Created single page application
* Added ability to search beers by name
* Display search results with image, name and taglines
* Allow user to add beer to basket
* Limit basket to only accept 10 kinds of beer (beer name)
* Limit basket to accept no more than 60 beers
* Display selected beers in basket
* Able to remove a selected beer from basket
* Include instructions on how to run application locally
* Host application on firebase
* Include instructions on how to view and amend hosted site

# Extra objectives achieved with a bit more time on Sunday
* Display a list of all brews, including pagination (e.g. https://api.punkapi.com/v2/beers?page=2&per_page=20) to select from that can be refined by search
* Include more ways of refining search e.g. by beer type ... hops, yeast, malt, perhaps with drop downs etc
* Organise basket so that the same type of beer is only listed once, with a count next to it
e.g. Pale Ale x 2

# Objectives I would still liked to have to have achieved to complete test
* Design a better looking and more user friendly site
* Include error handling
* Create friendlier modal dialog indicate errors and warnings
* Add the concept of users so a username can be associated with a beer choice
* Add database e.g. firestore to hold users details and basket
* Add authentication through firebase so only the expected 30 employees can view/ammend beer choices
