const UserModel = require("../models/userModel");
const AuthModel = require("../models/authModel");
const utils = require("../utils");

// this controller function is used to send otp to user email
const sendOtp = async (req, res, next) => {
  // validate request data
  if (!req.body.email) {
    return res.status(400).send({ statusCode: 400, message: "Validation error", error: {
        field: "email",
        message: "Email can not be empty"
      } });
  }
  try {
    // check if user already exist in user collection
    let {email} = req.body;
    const existingUser = await UserModel.findOne({ email });

    // Generate a six digit random otp
    let otp = utils.generateOtp();

    if (!existingUser) {
      // create a new user in user model
      await UserModel.create({ email });
    }

    //check if user is blocked user or not
    else if(existingUser.blockedAt !== null && existingUser.blockCounter === 4){
        const blockedTime = utils.caluculateTime(existingUser.blockedAt);
        if(blockedTime < 3600){
            return res.status(403).send({ statusCode: 403, message: `Your account has been blocked, because you have entered wrong OTP 5 times. please try after ${60 - ~~(blockedTime/60)} minute.` });
        }
        // else update user blockCounter by 0 and blockedAt by null
        existingUser.blockedAt = null;
        existingUser.blockCounter = 0
        existingUser.save();
    }

    //check if user try to send otp befor 1 min
    const authUser = await AuthModel.findOne({email: email});
    
    if(authUser){
        const time =  utils.caluculateTime(authUser.createdAt);
        if(time < 60){
            return res.status(400).send({statusCode: 400, message: 'Please wait for 1 minute to resend OTP.'}) 
        }
    }
    // add otp and user email in auth collection
    const result = await AuthModel.findOneAndUpdate({email},{$set: {otp,createdAt: Date.now()}}, {upsert:true, new:true});

    if (result) {
        // send otp to user email
        await utils.sendEmail(email, otp);

        return res.status(200).send({
          statusCode: 200,
          message: "OTP sent successfully",
          data: { email: result.email, otp: result.otp },
        });
    } else {
      return res.status(400).send({
          statusCode: 400,
          message: "Something went wrong. Please try again.",
        });
    }
  } catch (error) {
    return res.status(500).send({
        statusCode: 500,
        message: "Internal server error.",
        error: error,
      });
  }
};


const login = async (req, res, next) => {
    // validate request data
    const error = []
    if (!req.body.email) {
        error.push({field: "email", message: "Email can not be empty."})
    }
    if (!req.body.otp){
        error.push({field: "otp", message: "OTP can not be empty."})
    }

    if(error.length > 0){
        return res
          .status(400)
          .send({ statusCode: 400, message: "Validation error", error: error});
    }

    try {
        let {email, otp} = req.body
    // find user from user collection
        const user = await UserModel.findOne({email:email});
        if(!user){
            return res.status(400).send({ statusCode: 400, message: 'Invalid email address.' });
        }
        //get auth user
        const authUser = await AuthModel.findOne({email})
        //return error if user try 5 times with wrong otp
        if(authUser.otp !== Number(req.body.otp) && user.blockCounter === 4) {
            //update user with blockedAt
            await UserModel.findOneAndUpdate({email:email},{$set: {blockedAt: Date.now()}});
            
            return res.status(403).send({ statusCode: 403, message: 'Your account has been blocked for 1 hour, because you have entered wrong OTP 5 times. please try after 1 hour' });
        } else if(authUser.otp !== Number(otp)){
            //update blockCounter by 1
            await UserModel.findOneAndUpdate({email:email},{$set: {blockCounter: user.blockCounter + 1}});
            return res.status(400).send({ statusCode: 400, message: 'Incorrect otp' });
        }

        //delete auth user from auth collection
        await AuthModel.findOneAndDelete({email})
        // generate auth token using jwt
        const token = utils.generateAuthToken(user);
        // return succes response with token
        return res.status(200).send({statusCode:200, message:"Login success", token: token})

    } catch (error) {
        return res.status(500).send({ statusCode: 500, message: "Internal server error.", error: error });
    }
}


module.exports = {
  sendOtp,
  login,
};
