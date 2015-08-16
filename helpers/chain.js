/**
 * Allows chaining filters in handlebars placeholders
 */
module.exports.register = function (Handlebars, options)  { 
  Handlebars.registerHelper('chain', function() {
    var helpers = [];
    var args = Array.prototype.slice.call(arguments);
    var argsLength = args.length;
    var index;
    var arg;

    for (index = 0, arg = args[index];
         index < argsLength;
         arg = args[++index]) {
      if (Handlebars.helpers[arg]) {
        helpers.push(Handlebars.helpers[arg]);
      } else {
        args = args.slice(index);
        break;
      }
    }

    while (helpers.length) {
      args = [helpers.pop().apply(Handlebars.helpers, args)];
    }

    return args.shift();
  });
};