
if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI : 'mongodb+srv://dbuser_a:<password>@ideas-prod-x0u7h.mongodb.net/test?retryWrites=true&w=majority'};
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}