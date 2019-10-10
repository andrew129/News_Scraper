$.getJSON('/articles', function(data) {
    for (let i = 0; i < data.length; i++) {
        let newTitle = $('<h3>').text(data[i].title).attr('id', 'title').attr('data-id', data[i]._id).addClass('white')
        let newSummary = $('<p>').text(data[i].summary).attr('id', 'summary').attr('data-id', data[i]._id).addClass('white font')
        let newLink = $('<p>').text(data[i].link).attr('id', 'link').attr('data-id', data[i]._id).addClass('white')
        let commentButton = $('<button>').text('Show Comments').addClass('btn btn-primary w-100').attr('data-id', data[i]._id).attr('id', 'showcomments')
        $('#articles').append(newTitle, newSummary, newLink, commentButton)
    }
})

$(document).on('click', '#showcomments', function() {
    $('#comments').empty()

    let id = $(this).attr('data-id')

    $.ajax({
        method: 'GET',
        url: '/articles/' + id
    })
    .then(function(data) {
        console.log(data)

        let markup = `
            <form class='mt-3'>
                <div class='form-group'>
                    <label for='name'>Name</label
                    <input type='text' class='form-control' id='name' placeholder='Enter Name'>
                </div
                <div class='form-group'>
                    <label for='text'>Comment</label
                    <textarea class='form-control' id='comment' placeholder='Enter Comment...' rows='4'></textarea>
                </div
                <button type='submit' class='btn btn-primary w-100' data-id= ${data._id} id='post'>Post</button>
            </form>
        `;
        $('#comments').append(markup)
    })
})

