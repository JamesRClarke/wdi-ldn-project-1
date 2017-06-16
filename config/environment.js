
const port = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/wdi-ldn-project-1';

const secret = process.env.SESSION_SECRET || 'this is secret';



module.exports = { port, dbURI, secret };
