// Global variables
let superheroes = ["batman", "thor", "captain america", "hulk"];
let apiKey = 'g5t8rzBmA7CyL8n5km5vhPjOEfUXops4';
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
    });
  }
  // On-click event for selected superhero button -- add to document to handle newly created buttons
  // Class name superhero
  // Function name handleSuperheroButton
  $(document).on("click", ".superhero", function () {
    searchTerm = $(this).attr("data-superhero");

    // Build URL
    let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=g5t8rzBmA7CyL8n5km5vhPjOEfUXops4&q=${searchTerm}&limit=${queryLimit}&offset=0&lang=en`;
    // API GET request
    ajaxCall(queryURL);
  });


  // Invoke createButtons function
  createButtons();
});

