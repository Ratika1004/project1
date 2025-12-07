const jwt = require('jsonwebtoken');

const SECRET = process.env.TOKEN_SECRET;
const EXPIRES_IN = "1h";

const encodeToken = (payload) => {
    const p = { ...payload } ;
    if (p.password) delete p.password;
    return jwt.sign(p, SECRET, { expiresIn: EXPIRES_IN});
};

const decodeToken = (raw) => {
    if(!raw) return;
    const token = raw.includes(" ") ? raw.split(" ")[1] : raw;
    if(!token)return;
    try{
        return jwt.verify(token,SECRET);
    } catch(err){
        return;
    }

};

module.exports = { encodeToken, decodeToken };
