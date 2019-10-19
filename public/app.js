 $.getJSON('/articles', function(data) {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<div data-id='" + data[i]._id + "'>" + '<h4>' + '<strong>' + data[i].title + '</strong>' + '</h4>' + '<p>' + '<em>' + data[i].summary + '</em>' + '</p>' + '<p>' + data[i].link + '</p' + "</div>");
        let newButton = $('<button>').attr('data-id', data[i]._id).text('Add Comment').addClass('btn btn-primary w-33 mr-1 mb-3 comment')
        let newButtonTwo = $('<button>').attr('data-id', data[i]._id).text('Show Comments').addClass('btn btn-dark w-33 mr-1 mb-3 show-comment text-white')
        let newButtonThree = $('<button>').attr('data-id', data[i]._id).text('Delete Article').addClass('btn btn-danger w-33 mr-1 mb-3 delete-button')
        $('#articles').append(newButton)
        $('#articles').append(newButtonTwo)
        $('#articles').append(newButtonThree)
    }
})

$(document).on('click', "#scrape-article", function() {
  $('#articles').empty()
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .done(function(data){
      console.log(data)
      location.reload();
    });
})

$(document).on("click", ".comment", function() {
    $("#comments").empty();
    const thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        console.log(data);
        $("#comments").append("<p>" + data.title + "</p>");
        $("#comments").append("<input id='titleinput' name='name' placeholder='Enter Name' >");
        $("#comments").append("<textarea id='bodyinput' name='message' placeholder='Enter Comment'></textarea>");
        $("#comments").append("<button data-id='" + data._id + "' + class='w-100 btn btn-primary' + id='post'>Post</button>");
  
        if (data.comment) {
          console.log(data.comment)
          $("#titleinput").val(data.comment.name);
          $("#bodyinput").val(data.comment.message);
        }
      });
  });

$(document).on('click', '#post', function() {
    const thisId = $(this).attr("data-id");

    $.ajax({
        method: 'POST',
        url: '/articles/' + thisId,
        data: {
            title: $('#titleinput').val().trim(),
            body: $('#bodyinput').val().trim(),
        }
    }).then(function(data) {
        console.log(data)
        $('#comments').empty()
    })
    $("#titleinput").val("");
    $("#bodyinput").val("");
})

$(document).on('click', '.show-comment', function() {
  const thisId = $(this).attr("data-id");

  $.ajax({
    method: 'GET',
    url: '/articles/' + thisId
  }).then(function(data) {
    console.log(data.comment.message)
    if (data.comment) {
      let newP = $('<p>')
      newP.text(data.comment.message)
      $('#usercomments').append(newP)
    }
  })
})

$(document).on("click", ".delete-button", function () {
  const thisId = $(this).attr("data-id");
  $.ajax({
      method: "DELETE",
      url: "/articles/" + thisId
  })
      .then(function(data) {
        console.log(data)
        window.location.reload()
      })
})



