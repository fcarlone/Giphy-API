// Global variables
let superheroes = ["batman", "thor", "captain america", "hulk"];
// let apiKey = 'g5t8rzBmA7CyL8n5km5vhPjOEfUXops4';
let queryLimit = 10;
// let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=g5t8rzBmA7CyL8n5km5vhPjOEfUXops4&q=${searchTerm}&limit=${queryLimit}&offset=0&lang=en`;

// jQuery
$(document).ready(function () {

  // Create buttons for superheroes in 'superhereoes' array
  const createButtons = () => {
    // Delete previous buttons before adding new superhero button
    $("#buttons-view").empty();
    // for-loop through array of superheroes
    for (let i = 0; i < superheroes.length; i++) {
      // Create button tag
      let buttonTag = $("<button>");
      // Add a class
      buttonTag.addClass("superhero")
      // Add a data-attribute
      buttonTag.attr("data-superhero", superheroes[i]);
      // Add button text
      buttonTag.text(superheroes[i]);
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
        console.log('Rating: ', responseRating);
        // image src *** GET Fixed Height URL
        let responseImage = response.data[i].images.fixed_height_still.url;
        console.log('Original Image', responseImage);
        // data-still src
        let responseStill = response.data[i].images.fixed_height_still.url;
        console.log('Still Image', responseStill);
        // data-animate src
        let responseAnimate = response.data[i].images.fixed_height.url;
        console.log('Animate', responseAnimate);

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

        // Append to "response-image" class
        $(".response-image").append(imageTag)
      };

      // for-loop through response
      for (let i = 0; i < queryLimit; i++) {
        parseResponse(i);
      };

    });
  };

  // On-click event to handle when a superhero is entered and Submit button is clicked
  $("#add-superhero").on("click", function (event) {
    event.preventDefault();
    // Get the input value submitted from input form
    let superhero = $("#superhero-input").val().trim();
    console.log('on-Click event', superhero);
    // Add superhero to superheros array
    superheroes.push(superhero);
    // Invoke createButtons method to create new superhero button
    createButtons();
  });

  // On-click event for selected superhero button -- add to document to handle newly created buttons
  // Class name superhero
  // Function name handleSuperheroButton
  $(document).on("click", ".superhero", function () {
    // Clear previous image data
    $(".response-image").empty();
    searchTerm = $(this).attr("data-superhero");
    // Build URL
    let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=g5t8rzBmA7CyL8n5km5vhPjOEfUXops4&q=${searchTerm}&limit=${queryLimit}&offset=0&lang=en`;
    // API GET request
    ajaxCall(queryURL);
  });

  // // On-click event when gif image is clicked (store in state variable)
  $(document).on("click", ".gif", function () {
    let state = $(this).attr("data-state");
    console.log('state', state)
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

  // Invoke createButtons function
  createButtons();
});

