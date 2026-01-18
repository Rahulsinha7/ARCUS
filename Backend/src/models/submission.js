const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const submissionSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'problem',
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true,
        enum:['c++','java','javascript']
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending','accepted','wrong_answer','time_limit_exceeded','runtime_error']
    },
    runtime:{  //time complexity
        type:Number, //milliseconds
        default:0
    }, 
    memory:{   //space complexity
        type:Number, //in KB
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    },
    testCasesTotal:{
        type:Number,
        default:0
    },
    
},{timestamps:true});

submissionSchema.index({userId:1, problemId:1});

const Submission=mongoose.model('submission',submissionSchema);
module.exports=Submission;

