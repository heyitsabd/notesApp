const secret = '@bd@hmad';
const JWT = require('jsonwebtoken');

function createTokenForUser(user){
    const payload = {
        fullName: user.fullName,
        email:user.email,
        _id:user._id,
        profileImage: user.profileImage,
        role:user.role
    }
    const token = JWT.sign(payload,secret)
    return token
}

function validateToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}