$(document).ready(function() {
  // eslint-disable-next-line no-unused-vars
  /* global moment */

  // blogContainer holds all of our flashcards
  var blogContainer = $(".blog-container");
  var flashcardCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleFlashcardDelete);
  $(document).on("click", "button.edit", handleFlashcardEdit);
  // Variable to hold our flashcards
  var flashcards;

  // The code below handles the case where we want to get blog flashcards for a specific subject
  // Looks for a query param in the url for subject_id
  var url = window.location.search;
  var subjectId;
  if (url.indexOf("?subject_id=") !== -1) {
    subjectId = url.split("=")[1];
    getFlashcards(subjectId);
  }
  // If there's no subjectId we just get all flashcards as usual
  else {
    getFlashcards();
  }

  // This function grabs flashcards from the database and updates the view
  function getFlashcards(subject) {
    subjectId = subject || "";
    if (subjectId) {
      subjectId = "/?subject_id=" + subjectId;
    }
    $.get("/api/flashcards" + subjectId, function(data) {
      console.log("Flashcards", data);
      flashcards = data;
      if (!flashcards || !flashcards.length) {
        displayEmpty(subject);
      } else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete flashcards
  function deleteFlashcard(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/flashcards/" + id
    }).then(function() {
      getFlashcards(flashcardCategorySelect.val());
    });
  }

  // InitializeRows handles appending all of our constructed flashcard HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    var flashcardsToAdd = [];
    for (var i = 0; i < flashcards.length; i++) {
      flashcardsToAdd.push(createNewRow(flashcards[i]));
    }
    blogContainer.append(flashcardsToAdd);
  }

  // This function constructs a flashcard's HTML
  function createNewRow(flashcard) {
    var cardFlip = $("<div>");
    cardFlip.addClass("flip-card");
    var cardInner = $("<div>");
    cardInner.addClass("flip-card-inner");
    var front = $("<div>");
    front.addClass("flip-card-front");
    var back = $("<div>");
    back.addClass("flip-card-back");
    var newFlashcardCardHeading = $("<div>");
    newFlashcardCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newFlashcardTitle = $("<h2>");
    var newFlashcardSubject = $("<h5>");
    newFlashcardSubject.text("Subject: " + flashcard.Subject.name);
    newFlashcardSubject.css({
      float: "right",
      color: "blue",
      "margin-top": "-10px"
    });
    var newFlashcardCardBody = $("<div>");
    newFlashcardCardBody.addClass("card-body");
    var newFlashcardBody = $("<p>");
    newFlashcardTitle.text(flashcard.question + " ");
    newFlashcardBody.text(flashcard.answer);
    newFlashcardCardBody.append(deleteBtn);
    newFlashcardCardBody.append(editBtn);
    newFlashcardCardHeading.prepend(newFlashcardTitle);
    newFlashcardCardHeading.append(newFlashcardSubject);
    newFlashcardCardBody.prepend(newFlashcardBody);
    front.append(newFlashcardCardHeading);
    back.append(newFlashcardCardBody);
    cardInner.append(front);
    cardInner.append(back);
    cardFlip.append(cardInner);
    cardFlip.data("flashcard", flashcard);
    return cardFlip;
  }

  // This function figures out which flashcard we want to delete and then calls deleteFlashcard
  function handleFlashcardDelete() {
    var currentFlashcard = $(this)
      .parent()
      .parent()
      .parent()
      .parent()
      .data("flashcard");
    deleteFlashcard(currentFlashcard.id);
  }

  // This function figures out which flashcard we want to edit and takes it to the appropriate url
  function handleFlashcardEdit() {
    var currentFlashcard = $(this)
      .parent()
      .parent()
      .parent()
      .parent()
      .data("flashcard");
    window.location.href = "/create?flashcard_id=" + currentFlashcard.id;
  }

  // This function displays a message when there are no flashcards
  function displayEmpty(subjectId) {
    var query = window.location.search;
    var partial = "";
    if (subjectId) {
      partial = " for Subject #" + subjectId;
    }
    blogContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html(
      "No flashcards yet" +
        partial +
        ", navigate <a href='/create" +
        query +
        "'>here</a> in order to get started."
    );
    blogContainer.append(messageH2);
  }
});
