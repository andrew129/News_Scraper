const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let CommentSchema = new Schema({
    name: {
        type: String,
    },

    message: {
        type: String,
    },

    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
});

let Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;