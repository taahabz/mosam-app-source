const fs = require('fs');
const path = require('path');

const envContent = `MONGO_URI=mongodb+srv://mystiopath:XVNflw4Myj3lQsdh@readings.gudpakc.mongodb.net/?retryWrites=true&w=majority&appName=readings
PORT=5000`;
 
fs.writeFileSync(path.join(__dirname, '.env'), envContent);
console.log('.env file created successfully'); 