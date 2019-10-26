/* eslint-disable indent */
/* eslint-disable prettier/prettier */
$(document).ready(function() {
  // Getting jQuery references to the flashcard body, title, form, and subject select
	var titleInput = $("#title");
	var bodyInput = $("#body");
  var cmsForm = $("#cms");
  var subjectSelect = $("#subject");
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a flashcard)
  var url = window.location.search;
  var flashcardId;
  var subjectId;
  // Sets a flag for whether or not we're updating a flashcard to be false initially
  var updating = false;
  
  // If we have this section in our url, we pull out the flashcard id from the url
  // In '?flashcard_id=1', flashcardId is 1
  if (url.indexOf("?flashcard_id=") !== -1) {
    flashcardId = url.split("=")[1];
    getFlashcardData(flashcardId, "flashcard");
  }
  // Otherwise if we have an subject_id in our url, preset the subject select box to be our Subject
  else if (url.indexOf("?subject_id=") !== -1) {
    subjectId = url.split("=")[1];
  }
  
  // Getting the subjects, and their flashcards
  getSubjects();
  
  // A function for handling what happens when the form to create a new flashcard is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the flashcard if we are missing a body, title, or subject
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !subjectSelect.val()) {
      return;
    }
    // Constructing a newFlashcard object to hand to the database
    var newFlashcard = {
      question: titleInput
        .val()
        .trim(),
      answer: bodyInput
        .val()
        .trim(),
      SubjectId: subjectSelect.val()
    };
  
    // If we're updating a flashcard run updateFlashcard to update a flashcard
    // Otherwise run submitFlashcard to create a whole new flashcard
    if (updating) {
      newFlashcard.id = flashcardId;
      updateFlashcard(newFlashcard);
    }
    else {
      submitFlashcard(newFlashcard);
    }
  }
  
  // Submits a new flashcard and brings user to view cards page upon completion
  function submitFlashcard(flashcard) {
    $.post("/api/flashcards", flashcard, function() {
      var SubjectId = subjectSelect.val();
      // window.location.href = "/view_cards?subject_id=";
      window.location.href = "/view_cards?subject_id=" + SubjectId;
    });
  }
  
  // Gets flashcard data for the current flashcard if we're editing, or if we're adding to an subject's existing flashcards
  function getFlashcardData(id, type) {
    var queryUrl;
    switch (type) {
    case "flashcard":
      queryUrl = "/api/flashcards/" + id;
      break;
    case "subject":
      queryUrl = "/api/subjects/" + id;
      break;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.SubjectId || data.id);
        // If this flashcard exists, prefill our cms forms with its data
        // titleInput.val(data.title);
        // bodyInput.val(data.body);
        titleInput.val(data.question);
        bodyInput.val(data.answer);
        subjectId = data.SubjectId || data.id;
        // If we have a flashcard with this id, set a flag for us to know to update the flashcard
        // when we hit submit
        updating = true;
      }
    });
  }
  
  // A function to get Subjects and then render our list of Subjects
  function getSubjects() {
    $.get("/api/subjects", renderSubjectList);
  }
  // Function to either render a list of subjects, or if there are none, direct the user to the page
  // to create an subject first
  function renderSubjectList(data) {
    if (!data.length) {
      window.location.href = "/subjects";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createSubjectRow(data[i]));
    }
    subjectSelect.empty();
    console.log(rowsToAdd);
    console.log(subjectSelect);
    subjectSelect.append(rowsToAdd);
    subjectSelect.val(subjectId);
  }
  
  // Creates the subject options in the dropdown
  function createSubjectRow(subject) {
    var listOption = $("<option>");
    listOption.attr("value", subject.id);
    listOption.text(subject.name);
    return listOption;
  }
  
  // Update a given flashcard, bring user to the view cards page when done
  function updateFlashcard(flashcard) {
    $.ajax({
      method: "PUT",
      url: "/api/flashcards",
      data: flashcard
    })
      .then(function() {
        window.location.href = "/view_cards?subject_id=";
      });
  }
});