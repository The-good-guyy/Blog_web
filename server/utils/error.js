module.exports.errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
// const DB =
//   "mongodb+srv://Hien:<password>@cluster0.6mm6an4.mongodb.net/mernblog?retryWrites=true&w=majority&appName=Cluster".replace(
//     "<password>",
//     "JmPIJzYAva7oqmkw"
//   );
