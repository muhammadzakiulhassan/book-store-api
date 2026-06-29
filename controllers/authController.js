const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser.id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //   const { email, password } = req.body;
  const email = req.body.email;
  const password = req.body.password;

  // 1). Check if email and password exist
  if (!email || !password) {
    return next(new AppError('please provide email and password'));
  }
  // 2). Check if user exist and Password Correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect password or email', 401));
  }

  // 3.if everything is Ok send token to the client
  const token = signToken(user.id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1). Getting token and checks it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('you are not log in please log in to get access.', 401),
    );
  }

  // 2). Verification after token issued
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3). Check if user is still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('User belong to this token does no longer exist', 401),
    );
  }

  // 4).Check if user change password after token issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again', 401),
    );
  }

  // GRANT USER ACCESS
  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  // roles [admin] .role=user
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};
