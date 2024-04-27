const { randomBytes, createHmac } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/auth");

const userSchema = new Schema({
  fullName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  salt: {
    type: String,
  },
  password: {
    type: String,
    require: true,
  },
  profileImage: {
    type: String,
    default: "/images/default.png",
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const algorithm = "sha256";
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac(algorithm, salt)
    .update(user.password)
    .digest("hex");   // the .digest('hex') method converts the raw binary hash value computed by the hashing algorithm to a more human-readable hexadecimal string representation. 
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static("matchPasswordAndGenerateToken",async function (email, password) {    //for token generation
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    } 
      const algorithm = "sha256";
      const salt = user.salt;
      const hashedPassword = user.password;

      const userProvideHash = createHmac(algorithm, salt)
        .update(password)
        .digest("hex");
    
    if (hashedPassword !== userProvideHash) {
      throw new Error("Incorrect Password");
    }

    const token = createTokenForUser(user);
    return token;  
}
);

const User = model("user", userSchema);

module.exports = User;
