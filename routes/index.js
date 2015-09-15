// POC of a viable route
module.exports.hello = function *(next) {
  this.body = 'Hello World!';
};
