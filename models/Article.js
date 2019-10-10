let mongoose = require('mongoose')

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
    },

    summary: {
        type: String,
    },

    link: {
        type: String,
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;