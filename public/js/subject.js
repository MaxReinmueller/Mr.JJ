/* eslint-disable prettier/prettier */
/* eslint-disable indent */
$(document).ready(function() {
    // Getting references to the name input and subject container, as well as the table body
    var nameInput = $("#subject-name");
    var subjectList = $("tbody");
    var subjectContainer = $(".subject-container");
    // Adding event listeners to the form to create a new object, and the button to delete
    // an Subject
    $(document).on("submit", "#subject-form", handleSubjectFormSubmit);
    $(document).on("click", ".delete-subject", handleDeleteButtonPress);
  
    // Getting the initial list of Subjects
    getSubjects();
  
    // A function to handle what happens when the form is submitted to create a new Subject
    function handleSubjectFormSubmit(event) {
      event.preventDefault();
      // Don't do anything if the name fields haven't been filled out
      if (!nameInput.val().trim().trim()) {
        return;
      }
      // Calling the upsertSubject function and passing in the value of the name input
      upsertSubject({
        name: nameInput
          .val()
          .trim()
      });
    }
  
    // A function for creating an subject. Calls getSubjects upon completion
    function upsertSubject(subjectData) {
      $.post("/api/subjects", subjectData)
        .then(getSubjects);
    }
  
    // Function for creating a new list row for subjects
    function createSubjectRow(subjectData) {
      var newTr = $("<tr>");
      newTr.data("subject", subjectData);
      newTr.append("<td>" + subjectData.name + "</td>");
      if (subjectData.Flashcards) {
        newTr.append("<td> " + 
        // subjectData.Flashcards.length 
        + "</td>");
      } else {
        newTr.append("<td></td>"
          );
      }
      newTr.append("<td><a href='/view_cards?subject_id=" + 
      // CHECK IT OUT!!
      subjectData.id + "'>Go to Flashcards</a></td>");
      newTr.append("<td><a href='/create?subject_id=" + subjectData.id + "'>Create a Flashcard</a></td>");
      newTr.append("<td><a style='cursor:pointer;color:red' class='delete-subject'>Delete Subject</a></td>");
      return newTr;
    }
  
    // Function for retrieving subjects and getting them ready to be rendered to the page
    function getSubjects() {
      $.get("/api/subjects", function(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
          rowsToAdd.push(createSubjectRow(data[i]));
        }
        renderSubjectList(rowsToAdd);
        nameInput.val("");
      });
    }
  
    // A function for rendering the list of subjects to the page
    function renderSubjectList(rows) {
      subjectList.children().not(":last").remove();
      subjectContainer.children(".alert").remove();
      if (rows.length) {
        console.log(rows);
        subjectList.prepend(rows);
      }
      else {
        renderEmpty();
      }
    }
  
    // Function for handling what to render when there are no subjects
    function renderEmpty() {
      var alertDiv = $("<div>");
      alertDiv.addClass("alert alert-danger");
      alertDiv.text("You must create a Subject before you can create a Flashcard.");
      subjectContainer.append(alertDiv);
    }
    console.log("hello");
  
    // Function for handling what happens when the delete button is pressed
    function handleDeleteButtonPress() {
      var listItemData = $(this).parent("td").parent("tr").data("subject");
      var id = listItemData.id;
      $.ajax({
        method: "DELETE",
        url: "/api/subjects/" + id
      })
        .then(getSubjects);
    }
  });
  