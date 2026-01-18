const { getLanguageById,submitBatch,submitToken } = require('../utils/problemUtility');
const Problem=require('../models/problem');
const User=require('../models/users');
const Submission = require('../models/submission');
const SolutionVideo=require('../models/solutionVideo');

const createProblem =async(req,res)=>{
    const {title,description,tags,difficulty,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;

    try{
        for(const {language,completeCode} of referenceSolution){
            // source_code:
            //language_id:
            // stdin:
            // expectedOutput:

            const languageId=getLanguageById(language);

            // creating batch submissions
            const submissions=visibleTestCases.map((testcase)=>({
                source_code:completeCode, 
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output
              
            })); 
             


            const submitResult=await submitBatch(submissions);
            console.log(submitResult);

            const resultToken=submitResult.map((value)=>value.token);


            const testResult=await submitToken(resultToken);
              console.log(testResult);
            for(const test of testResult){
                if(test.status_id!=3){
                  return  res.status(400).send("Error Occured");
                }
            }
        }

        //we can store it in our DB

        const userProblem=await Problem.create({
            ...req.body,
            problemCreator:req.result._id

        }); 
        res.status(201).send("problem saved successfully");

    }
    catch(err){
        res.status(400).send("Error: "+err);
    } 
    
}

const updateProblem=async(req,res)=>{
    const {id}=req.params;
     const {title,description,tags,difficulty,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;

    try{
        if(!id){
           return res.status(400).send("Missing id filed");
        }
        const DsaProblem=Problem.findById(id);
        if(!DsaProblem){
            return res.status(404).send("Id is not present in server");        }
        

           for(const {language,completeCode} of referenceSolution){
            

            const languageId=getLanguageById(language);

            // creating batch submissions
            const submissions=visibleTestCases.map((testcase)=>({
                source_code:completeCode, 
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output
              
            })); 
             


            const submitResult=await submitBatch(submissions);
            // console.log(submitResult);

            const resultToken=submitResult.map((value)=>value.token);


            const testResult=await submitToken(resultToken);
            //  console.log(testResult);
            for(const test of testResult){
                if(test.status_id!=3){
                  return  res.status(400).send("Error Occured");
                }
            }


        }


      const newProblem= await Problem.findByIdAndDelete(id,{...req.body},{runValidators:true,new:true});

      res.status(200).send(newProblem);
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }

}

const deleteProblem=async(req,res)=>{
    const{id}=req.params;
    try{
        if(!id)
            return res.status(400).send("ID is Missing");

        const deletedproblem=await Problem.findByIdAndDelete(id);

        if(!deletedproblem){
            return res.status(404).send("Problem not found");
        }

        res.status(200).send("Problem deleted successfully");
    }
    catch(err){
        res.status(500).send("Error: "+err);

    }

}

const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution ');
   
    // video ka jo bhi url wagera le aao

   if(!getProblem)
    return res.status(404).send("Problem is Missing");

   const videos = await SolutionVideo.findOne({problemId:id});

   if(videos){ 
    
    const responseData={
        ...getProblem.toObject(), // Convert Mongoose document to plain object
   secureUrl: videos.secureUrl,
   thumbnailUrl:videos.thumbnailUrl,
   duration:videos.duration
    }


   return res.status(200).send(responseData);
   }
    
   res.status(200).send(getProblem);

  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const getAllProblem=async(req,res)=>{
  
    try{
       
        const getProblem=await Problem.find({}).select('_id title difficulty tags');

        if(getProblem.length==0){
            return res.status(404).send("Problem is missing");
        }

        res.status(200).send(getProblem);
    }
    catch(err){
        res.status(500).send("Error: "+err);

    }

}

const solvedAllProblembyUser=async(req,res)=>{
    try{
        // const count=req.result.problemSolved.length;

        const userId=req.result._id;

        const user=await User.findById(userId).populate({
            path:'problemSolved',
            select:" _id title difficulty tags"
        });

        res.status(200).send(user.problemSolved);

    }
    catch(err){
        res.status(500).send("server error:");
    }

}

const submittedProblem=async(req,res)=>{
    try{
        const userId=req.result._id;

        const problemId=req.params.pid;

        const ans= await Submission.find({userId,problemId});

        if(ans.length==0)
            res.status(200).send("No submission found for this problem");

        res.status(200).send(ans); 
        

    }
    catch(err){
        res.status(500).send("Internal server Error ");
    }

}


module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};
