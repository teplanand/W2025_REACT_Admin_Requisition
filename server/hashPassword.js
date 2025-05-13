const bcrypt = require('bcryptjs');

const password = 'admin123'; // The password you want for the admin
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);