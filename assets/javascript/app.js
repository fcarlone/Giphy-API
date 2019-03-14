// Global variables
let topics = ["batman", "thor", "captain america", "hulk"];
let superheroName = '';
// let apiKey = 'g5t8rzBmA7CyL8n5km5vhPjOEfUXops4';
let queryLimit = 10;
// let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=g5t8rzBmA7CyL8n5km5vhPjOEfUXops4&q=${searchTerm}&limit=${queryLimit}&offset=0&lang=en`;

// jQuery
$(document).ready(function () {

  // Create buttons for superheroes in 'topics' array
  const createButtons = () => {
    // Delete previous buttons before adding new superhero button
    $("#buttons-view").empty();
    // for-loop through array of superheroes/topics
    for (let i = 0; i < topics.length; i++) {
      // Create button tag
      let buttonTag = $("<button>");
      // Add a class
      buttonTag.addClass("superhero")
      // Add a data-attribute
      buttonTag.attr("data-superhero", topics[i]);
      // Add button text
      buttonTag.text(topics[i]);
      // Add button to HTML file.
      $("#buttons-view").append(buttonTag);
    };
  };

  // Ajax call to Giphy API
  const ajaxCall = (queryURL) => {
    console.log('queryURL', queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response)
      // *** Parse response JSON function ***
      function parseResponse(i) {
        // rating
        let responseRating = response.data[i].rating;
        // gif title
        let responseTitle = response.data[i].title;
        // import date
        let responseImportDate = response.data[i].import_datetime
        let date = new Date(responseImportDate)
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let convertedImportDate = (date.toLocaleDateString("en-US", options))
        // image src
        let responseImage = response.data[i].images.fixed_height_still.url;
        // data-still src
        let responseStill = response.data[i].images.fixed_height_still.url;
        // data-animate src
        let responseAnimate = response.data[i].images.fixed_height.url;

        // Create image tag
        let imageTag = $("<img>")
        // src attribute
        imageTag.attr("src", responseImage);
        // data-still attribute
        imageTag.attr("data-still", responseStill);
        // data-animate attribute
        imageTag.attr("data-animate", responseAnimate);
        // data-state
        imageTag.attr("data-state", "still");
        // add class "gif"
        imageTag.addClass("gif");
        // add bootstrap class
        imageTag.addClass("card-img-top");

        // Create bootstrap cards
        let card = $("<div>");
        card.addClass("card");

        let cardBody = $("<div>");
        cardBody.addClass("card-body");

        let cardText = $("<p>").text(`Title: ${responseTitle}`);
        cardText.addClass("card-text")
        let cardTextRating = $("<p>").text(`Rating: ${responseRating}`);
        cardTextRating.addClass("card-text")
        let cardImportDate = $("<p>").text(`Import Date: ${convertedImportDate}`);
        cardImportDate.addClass("card-text")

        let appendOne = $(cardBody).append(cardText);
        let appendTwo = $(cardBody).append(cardTextRating);
        let appendThree = $(cardBody).append(cardImportDate);

        $(card).append(imageTag);
        $(card).append(appendOne);
        $(card).append(appendTwo);
        $(card).append(appendThree);

        $(".row").append(card);
      };

      // for-loop through response
      for (let i = 0; i < queryLimit; i++) {
        parseResponse(i);
      };
      // Add superhero name above gifs and button to display movies related to the superhero
      let superheroTitle = $("<h2>").text(`Superhero: ${searchTerm}`)
      superheroTitle.addClass("superhero-title")
      $(".superhero-name").append(superheroTitle)

      let superheroMovieButton = $("<button>")
      $(superheroMovieButton).text(`see movies related to ${searchTerm}`)

      $(".superhero-movie-button").append(superheroMovieButton);
    });
  };

  // On-click event to handle when a superhero is entered and Submit button is clicked
  $("#add-superhero").on("click", function (event) {
    event.preventDefault();

    // Get the input value submitted from input form
    let superhero = $("#superhero-input").val().trim();
    // Validate input value
    if (!superhero) {
      $(".user-message").text(`Please enter a valid name.`)
    }
    else if (topics.includes(superhero)) {
      $(".user-message").text(`A ${superhero} button already exists.`)
    } else {
      // Add superhero to superheros array
      topics.push(superhero);
      // Invoke createButtons method to create new superhero button
      createButtons();
    }
    // Reset form value to blank
    $("#superhero-input").val('');
  });

  // const validateForm = () => {
  //   let superheroInput = document.forms["superheroForm"]["superhero-input"].value
  //   console.log('superhero', superheroInput, topics)
  //   // Check input value against topics array 
  //   if (topics.includes(superheroInput)) {
  //     console.log('true')
  //   } else {
  //     console.log('false')
  //   }
  // }
  // $(document).on("click", "#add-superhero", validateForm)


  // On-click event for selected superhero button -- add to document to handle newly created buttons
  // Class name superhero
  // Function name handleSuperheroButton
  $(document).on("click", ".superhero", function () {
    // Clear previous image data
    $(".superhero-name").empty();
    $(".superhero-movie-button").empty();
    $(".row").empty();
    // Reset limit to 10
    queryLimit = 10;
    searchTerm = $(this).attr("data-superhero");
    // Build URL
    let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=g5t8rzBmA7CyL8n5km5vhPjOEfUXops4&q=${searchTerm}&limit=${queryLimit}&offset=0&lang=en`;
    // API GET request
    ajaxCall(queryURL);
  });

  // On-click event when gif image is clicked (store in state variable)
  $(document).on("click", ".gif", function () {
    let state = $(this).attr("data-state");
    if (state === "still") {
      let animate = $(this).attr("data-animate");
      $(this).attr("src", animate);
      $(this).attr("data-state", "animate");
    };
    if (state === "animate") {
      let still = $(this).attr("data-still");
      $(this).attr("src", still);
      $(this).attr("data-state", "still")
    }
  });

  // on-click event - add more gifs
  $(document).on("click", "#add-gifs", function () {
    queryLimit += 10;
    // Clear previous image data
    $(".superhero-name").empty();
    $(".superhero-movie-button").empty();
    console.log("add gifs button", queryLimit);
    // Empty 'response-image' div - replace with new limit
    $(".row").empty();
    // Build URL and make ajax call;
    let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=g5t8rzBmA7CyL8n5km5vhPjOEfUXops4&q=${searchTerm}&limit=${queryLimit}&offset=0&lang=en`;
    ajaxCall(queryURL);
  });

  // Invoke createButtons function
  // validateForm();
  createButtons();
});

