$.getJSON('/articles', function(data) {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + '<strong>' + data[i].title + '</strong>' + "<br />" + data[i].summary + "<br />" + data[i].link + "</p>");
        let newButton = $('<button>').attr('data-id', data[i]._id).text('Add Comment').addClass('btn btn-primary w-100 comment')
        let newButtonTwo = $('<button>').attr('data-id', data[i]._id).text('Show Comments').addClass('btn btn-secondary w-100 show-comment')
        $('#articles').append(newButton, newButtonTwo)
    }
})

$('#scrape-article').on('click', function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(function(data){
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + '<strong>' + data[i].title + '</strong>' + "<br />" + data[i].summary + "<br />" + data[i].link + "</p>");
        let newButton = $('<button>').attr('data-id', data[i]._id).text('Add Comment').addClass('btn btn-primary w-100 comment')
        let newButtonTwo = $('<button>').attr('data-id', data[i]._id).text('Show Comments').addClass('btn btn-secondary w-100 show-comment')
        $('#articles').append(newButton, newButtonTwo)
      }
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
        $("#comments").append("<h2>" + data.title + "</h2>");
        $("#comments").append("<input id='titleinput' name='name' placeholder='Enter Name' >");
        $("#comments").append("<textarea id='bodyinput' name='message' placeholder='Enter Comment'></textarea>");
        $("#comments").append("<button data-id='" + data._id + "' + class='w-100 btn btn-primary' + id='post'>Post</button>");
  
        if (data.comment) {
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


// $(document).on('click', '.show-comment', function() {
//   const thisId = $(this).attr("data-id");

//   $.ajax({
//     method: 'GET',
//     url: '/articles/' + thisId
//   }).then(function(response) {
//     console.log(response)
//     let userComment = $('<p>')
//     userComment.text(response.comment)
//     $('#userComments').append(userComment)
//   })
// })

