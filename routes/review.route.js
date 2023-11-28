const express = require("express")
const {reviewModel} = require("../model/review.model")
const {userModel} = require('../model/user.model');
const {movieModel} = require("../model/movie.model");
const auth = require("../auth/auth")

const reviewRouter = express.Router()


reviewRouter.get("/reviews/:movieId",async(req,res)=>{
    try{ 
        const reviews = await reviewModel.find({movie:req.params.movieId}).populate("user")
        res.status(200).json(reviews)

    }
    catch(err){
        console.log(err)
        res.status(502).json({msg:"Something went wrong"})
    }
})




//update the reviews by therir IDs 

reviewRouter.patch("/reviews/:reviewId",auth,async(req,res)=>{
    try{
        const review = await reviewModel.findById(req.params.reviewId)
        if (!review){
            return res.status(501).json({msg:"review not found"})
        }

        if (!review.user.toString() !== req.params._id.toString()){
            return res.status(502).json({msg:"something went wrong to update this reviews"})
        }

        review.rating = req.body.rating || review.rating
        review.comment = req.body.comment || review.comment
        review.timestamp = new Date()

        await review.save()
        res.status(204).json({msg:"Review updated.."})

    }
    catch(err){
        console.log(err)
        res.status(502).json({msg:"something went wrong"})
    }
})


reviewRouter.delete('/reviews/:reviewId',auth,async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id);
      const review = await reviewModel.findById(req.params.reviewId);
  
      if (!user || !review) {
        return res.status(404).json({ msg:"User or review not found"});
      }
      if (review.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'Unauthorized to delete this review.' });
      }
      user.reviews = user.reviews.filter(id => id.toString() !== req.params.reviewId);
      user.watchedMovies = user.watchedMovies.filter(id => id.toString() !== review.movie.toString());
      await user.save();
  
      // Remove the review 
      await review.remove();
  
      res.status(202).json({ msg: "Review deleted successfully"});
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "something went wrong" });
    }
  });



  reviewRouter.get('/recommendations', auth,async(req, res) => {
    try {
      const user = await userModel.findById(req.user._id).populate('watchedMovies reviews');
      const recommendations = [];
  
      res.status(200).json({ recommendations });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Internal Server Error.' });
    }
  });

module.exports = {
    reviewRouter
}