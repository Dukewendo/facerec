const app = require('http')
.createServer((req, res) => res.end('Oh hi, didn\'t see you there!'));

const DATABASE_URL = process.env.DATABASE_URL

app.listen(3002, () => {
    console.log(`server running on port ${DATABASE_URL}`);
});

console.log(3002);