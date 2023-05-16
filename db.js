const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/assignment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
//   useCreateIndex: true,
})
.then(() => console.log("Mongodb connected."))
.catch(error => console.log("Mongodb connection error", error))
