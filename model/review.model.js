const mongoose = require("mongoose")


const reviweSchema = new mongoose.Schema({
    // _id: ObjectId,.
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    movie : { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    rating: Number,
    comment: String,
    timestamp: Date
})

const reviewModel = mongoose.model("Review",reviweSchema)


module.exports ={
    reviewModel
}