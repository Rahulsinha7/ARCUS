const express=require('express');
// const { get } = require('mongoose');
const problemRouter=express.Router();

const adminMiddleware=require('../middleware/adminMiddleware');
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem}=require('../controllers/userProblem')
const userMiddleware=require('../middleware/userMiddleware')


problemRouter.post("/create",adminMiddleware,createProblem); // access by admin only and pass throgh middleware 
problemRouter.put ("/update/:id",adminMiddleware,updateProblem);  //admin
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);  //admin

problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem) 

module.exports=problemRouter; 