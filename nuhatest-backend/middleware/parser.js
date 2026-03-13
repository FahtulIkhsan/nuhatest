const parseJSONBody = async (req) => {
    let body = '';
    for await (const chunk of req) body += chunk.toString();
    return body ? JSON.parse(body) : {};
};

const sendJSON = (res, statusCode, data) => {
    if (!res.headersSent) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }
};

module.exports = { parseJSONBody, sendJSON };