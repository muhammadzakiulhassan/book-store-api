const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'please enter a valid email'],
    lowercase: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12

  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password of the confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userpassword,
) {
  return await bcrypt.compare(candidatePassword, userpassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if(this.passwordChangedAt){
    const changeTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10)
    return JWTTimestamp<changeTimestamp
  }

 
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
