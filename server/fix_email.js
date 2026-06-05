const fs = require('fs');
let code = fs.readFileSync('index.js', 'utf8');
code = code.replace(/from:\s*'"Kitchen Connection"\s*<noreply@kitchenconnection\.(com|id)>'/g, "from: '\"Kitchen Connection\" <' + (process.env.EMAIL_SENDER || process.env.BREVO_USER) + '>'");
fs.writeFileSync('index.js', code);
console.log('Done');
