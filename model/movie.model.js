const mongoose = require("mongoose")


const movieSchema = mongoose.Schema({

    title: String,
    genre: [String],
    releaseYear: Number,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
   
})


const movieModel = mongoose.model("Movie",movieSchema)



module.exports = {
    movieModel
}
