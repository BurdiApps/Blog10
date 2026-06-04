const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Blog10 API',
    description: 'Blog10 - Daily Idea & Brainstorm Journal API'
  },
  host: 'blog10-epia.onrender.com',
  schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);