// Global variables
let topics = ["batman", "thor", "captain america", "hulk", "wonder woman", "rocket raccoon", "flash", "starfire", "ant-man", "daredevel", "she-hulk", "luke cage", "wolverine"];
let superheroName = '';
// let apiKey = 'g5t8rzBmA7CyL8n5km5vhPjOEfUXops4';
let queryLimit = 10;
// let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=g5t8rzBmA7CyL8n5km5vhPjOEfUXops4&q=${searchTerm}&limit=${queryLimit}&offset=0&lang=en`;
// let themoviedb example = http://api.themoviedb.org/3/search/movie?api_key=bbaefc5cfba8d768b17fb5ce96e4a7f2&query=thor;
// jQuery
$(document).ready(function () {

  // Setup Giphy site
  $(".user-message").text("Select or add a superhero");
  $("#add-gifs").hide();
  $("#clear-all").hide();

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

        let cardText = $("<p>").html(`<strong>Title:</strong> ${responseTitle}`);
        cardText.addClass("card-text")
        let cardTextRating = $("<p>").html(`<strong>Rating:</strong> ${responseRating}`);
        cardTextRating.addClass("card-text")
        let cardImportDate = $("<p>").html(`<strong>Import Date:</strong> ${convertedImportDate}`);
        cardImportDate.addClass("card-text")

        let appendOne = $(cardBody).append(cardText);
        let appendTwo = $(cardBody).append(cardTextRating);
        let appendThree = $(cardBody).append(cardImportDate);

        $(card).append(imageTag);
        $(card).append(appendOne);
        $(card).append(appendTwo);
        $(card).append(appendThree);

        $(".row").append(card);

        // Show add more gifs button
        $("#add-gifs").show();
      };

      // for-loop through response
      for (let i = 0; i < queryLimit; i++) {
        parseResponse(i);
      };
      // Add superhero name above gifs and button to display movies related to the superhero
      let superheroTitle = $("<h2>").text(`Superhero: ${searchTerm}`)
      superheroTitle.addClass("superhero-title")
      $(".superhero-name").append(superheroTitle)

      let superheroMovieButton = $("<button>");
      superheroMovieButton.addClass("add-movie");
      $(superheroMovieButton).text(`See movies related to ${searchTerm}`)

      $(".superhero-movie-button").append(superheroMovieButton);
    });
  };

  // ajax call - get movie information based on superhero name
  const ajaxMovieRequest = (superhero) => {
    let movieQueryURL = `http://api.themoviedb.org/3/search/movie?api_key=bbaefc5cfba8d768b17fb5ce96e4a7f2&query=${superhero}`;
    console.log('the ajaxMovieRequest function', superhero)
    $.ajax({
      url: movieQueryURL,
      method: "GET"
    }).then(function (response) {
      console.log('movie response', response)

      // Get movie data
      function movieResults(i) {
        let movieTitle = response.results[i].title;
        // let movieRating = response.results[i].rating;
        let movieOverview = response.results[i].overview;
        let movieReleaseDate = response.results[i].release_date;
        let date = new Date(movieReleaseDate)
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let convertedMovieDate = (date.toLocaleDateString("en-US", options))
        let moviePosterPath = `https://image.tmdb.org/t/p/original${response.results[i].poster_path}`;

        console.log('movieTitle', movieTitle)
        // console.log('movieRating', movieRating)
        console.log('movieRelease', convertedMovieDate)
        console.log('movieOverview', movieOverview)
        console.log('moviePoster', moviePosterPath);

        // Display 5 movies 
        let movieDiv = $("<div>").addClass("movie")

        let movieTitleTag = $("<p>").html(`<strong>Movie Title: </strong>${movieTitle}`);
        let movieOverviewTag = $("<p>").html(`<strong>Plot: </strong>${movieOverview}`);
        let movieReleaseDateTag = $("<p>").html(`<strong>Release Date: </strong>${convertedMovieDate}`);
        let moviePosterTag = $("<img>").attr("src", moviePosterPath);
        // add alternate text
        moviePosterTag.attr("alt", "image not available");


        $(movieDiv).append(movieTitleTag);
        $(movieDiv).append(movieOverviewTag);
        $(movieDiv).append(movieReleaseDateTag);
        $(movieDiv).append(moviePosterTag);

        $(".movies").append(movieDiv);

      }
      for (let i = 0; i <= 4; i++) {
        movieResults(i);
      }
    });
  }

  // On-click event to handle when a superhero is entered and Submit button is clicked
  $("#add-superhero").on("click", function (event) {
    event.preventDefault();
    $(".user-message").text("You successfully added a new superhero button")
    // Get the input value submitted from input form
    let superhero = $("#superhero-input").val().trim().toLowerCase();
    // Validate input value
    if (!superhero) {
      $(".user-message").text(`Please enter a valid name`)
    } else if (topics.includes(superhero)) {
      $(".user-message").text(`A ${superhero} button already exists`)
    } else {
      // Add superhero to superheros array
      topics.push(superhero);
      // Invoke createButtons method to create new superhero button
      createButtons();
    }
    // Reset form value to blank
    $("#superhero-input").val('');
  });

  // On-click event for selected superhero button -- add to document to handle newly created buttons
  // Class name superhero
  $(document).on("click", ".superhero", function () {
    $(".user-message").text("Select from the buttons below or select another superhero")
    // Show superhero-container
    $(".superhero-container").show();
    // Show response-container
    $(".response-container").show();
    // Show clear all button
    $("#clear-all").show();
    // Clear previous movie data
    $(".movies").empty();
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

    // Scroll to gifs images
    $("html, body").animate({
      scrollTop: $(".superhero-container").offset().top
    }, "slow");
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
  $("#add-gifs").on("click", function () {
    event.preventDefault();
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

  // on-click event - clear all gifs and movie detail
  $("#clear-all").on("click", function () {
    // hide response-container
    $(".response-container").hide();
    // hide superhero-container
    $(".superhero-container").hide();
    $(".user-message").text("Data is cleared")
  });

  // on-click event - invoke the ajaxMovieRequest function
  $(".superhero-movie-button").on("click", function () {
    console.log(".superhero-movie-button button clicked", searchTerm)
    // Invoke ajaxMovieRequest function
    ajaxMovieRequest(searchTerm);
  })

  // Invoke createButtons function
  // validateForm();
  createButtons();
});

