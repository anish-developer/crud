const errorHandler = (msg, success, data, code) => {
  let obj = {};
  obj["message"] = msg;
  obj["success"] = success;
  obj["data"] = data;
  obj["success_code"] = code;
  return obj;
};

module.exports = errorHandler;
