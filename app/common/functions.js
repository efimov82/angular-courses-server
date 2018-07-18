exports.generateSlug = function(slugLength = 8) {
  let res = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < slugLength; i++)
    res += possible.charAt(Math.floor(Math.random() * possible.length));

  return res;
};
