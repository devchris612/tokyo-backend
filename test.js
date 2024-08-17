const bcrypt = require('bcrypt');
const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPw = await bcrypt.hash(password, salt);
  return hashedPw;
};

hashPassword('string');
