const express = require("express")
const {movieModel} = require("../model/movie.model")
const auth = require("../auth/auth")
const { userModel } = require("../model/user.model")
const { reviewModel } = require("../model/review.model")
const movieRouter = express.Router()


movieRouter.post('/movies', async (req,res) =>{
    try {
      const { title, genre, releaseYear } = req.body;
      const movie = new movieModel({
        title,
        genre,
        releaseYear,
      })
      await movie.save();
      res.status(201).send('Movies added successfully');
    } catch (error) {
      res.status(500).send('something went wrong');
    }
  });
//for the get alll movies 

movieRouter.get("/movies",async(req,res)=>{
     try{
        const movies = await movieModel.find()
        res.status(200).json({msg:"all movies are here",movies})

     }
     catch(err){
        console.log(err)
        res.status(501).json({msg:"Something went wrong"})
     }

})

//get details of specific movies by thereir iddss

movieRouter.get("/movies/:id",async(req,res)=>{
    const movie = await movieModel.findById(req.params.id)
    if (!movie) {
        return res.status(502).json({msg:"Movie not found"})

    }
    res.status(200).json(movie)
})


// post ur movies from here  

movieRouter.post("/reviews/:movieId", auth, async (req, res) => {
    try {
      const user = await userModel.findById(req.params._id);
      const movie = await movieModel.findById(req.params.movieId);

      if (!user || !movie) {
        return res.status(404).json({ msg: "User or movie not found." });
      }
  
      const { rating, comment } = req.body;
  
      if (!rating || !comment) {
        return res.status(400).json({ msg: "Rating and comment are required." });
      }
      const review = new reviewModel({
        user: user._id,
        movie: movie._id,
        rating,
        comment,
        timestamp: new Date(),
      });
  
      await review.save();
  
      user.reviews.push(review._id);
      user.watchedMovies.push(movie._id);
      await user.save();


      movie.reviews.push(review._id);
      await movie.save();
  
      res.status(201).json({ msg: "Review added successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "something went wrong" });
    }
  });

module.exports = {
    movieRouter
}