$(document).ready(() => {
  // Getting a reference to the input field where user adds a new todo;
  // let $newItemInput = $("input.new-search");
  // Our new todos will go inside the todoContainer;

  const searchInput = $("input.new-search");
 
 

  const $searchContainer = $(".search-container");
  // Adding event listeners for deleting, editing, and adding todos;
  // $(document).on("click", "button.delete", deleteEvent);
  // $(document).on("click", ".new-item", selectEvent);
  // $(document).on("blur", ".new-item", cancelEdit);
  // $(document).on("submit", "#todo-form", insertTodo);
  const searchForm = $("a#search");
  
  // Our initial todos array
  let opp = [];

 
  // Getting todos from database when page loads
  
  searchForm.on("click", event => {
    event.preventDefault();
    const searchQuery = searchInput.val().trim();
    console.log(searchQuery);
    if (!searchQuery) {
      return;
    }
    search(searchQuery);
  });

  function search(searchQuery) {
    $.post("/api/event", {
      query: searchQuery
    })
      .then(() => {
        window.location.replace("/api/event");
      })
      .catch(searchErr);
      search();
  }

  function searchErr(err) {
    $("#alert.msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }







  function initializeRows() {
    $searchContainer.empty();
    const rowsToAdd = [];
    for (let i = 0; i < opp.length; i++) {
      rowsToAdd.push(createNewRow(opp[i]));
    }
    $eventContainer.prepend(rowsToAdd);
  }

  function getEvents() {
    $.get("/api/event", data => {
      opp = data;
      console.log(opp);
      initializeRows();
    });
  }
  getEvents();
});

function createNewRow(opp) {
  const $newInputRow = $(
    [
      "<li class='list-group-item new-item'>",
      "<span>",
      "<h5>",
      opp.event_name,
      "</h5>",
      opp.address,
      "<p>",
      opp.city,
      ", " + opp.state,
      " " + opp.zip,
      "</p>",
      "<p>",
      opp.details,
      "</p>",  
      "<p class = time>",
      "Posted: " + opp.createdAt,
      "</p>",
      "<p class = time>",
      "Updated: " + opp.updatedAt,
      "</p>",
      "</li>"
    ].join("")
  );

  
  $newInputRow.data("event", opp);

  return $newInputRow;
}
