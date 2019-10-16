const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let CommentSchema = new Schema({
    name: {
        type: String,
    },

    message: {
        type: String,
    }
});

let Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;