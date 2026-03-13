const http = require('http');
const router = require('./routers'); 
require('dotenv').config();

const PORT = process.env.PORT ;

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    await router(req, res);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));