const bcrypt = require('bcrypt');

const encodePassword = (raw) => {
    try{
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(raw,salt);
    } catch(err){
        console.error("encodePassword error: " , err);
        throw err;
    }
};

const matchPassword = (raw, encoded) => {
    try{
        return bcrypt.compareSync(raw, encoded);
    } catch(err){
        console.error("matchPassword error: " , err);
        return false;
    }
};

module.exports = { encodePassword, matchPassword };