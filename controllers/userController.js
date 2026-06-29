const User=require('./../models/userModel')
const catchAsync=require('./../utils/catchAsync')
const AppError=require('./../utils/appError')

exports. getAllUsers = catchAsync(async(req, res,next) => {

  const users=await User.find();
  res.status(200).json({
    status: 'success',
    result:users.length,
   data:{
    users
   }
  });
});

exports. createUsers = (req, res) => {
  res.status(505).json({
    status: 'err',
    message: 'This Route is not implemented yet',
  });
};

exports. getUser = (req, res) => {
  res.status(505).json({
    status: 'err',
    message: 'This Route is not implemented yet',
  });
};

exports. updateUser = (req, res) => {
  res.status(505).json({
    status: 'err',
    message: 'This Route is not implemented yet',
  });
};

exports. deleteUser = (req, res) => {
  res.status(505).json({
    status: 'err',
    message: 'This Route is not implemented yet',
  });
};
