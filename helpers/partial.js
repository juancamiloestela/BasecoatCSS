/**
 * Allow loading partials with dynamic name at runtime
 */
module.exports.register = function (Handlebars, context) {

    Handlebars.registerHelper("partial", function (name) {
    	name = name.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');

        var fn,
            template = Handlebars.partials[name];

        if (template === undefined){
        	console.log("Template " + name + " not found");
        	return "Template " + name + " not found";
        } else if (typeof template !== 'function') {
            // not compiled, so we can compile it safely
            fn = Handlebars.compile(template);
        } else {

            // already compiled, just reuse it
            fn = template;
        }

        var output = fn({name: name.toLowerCase().replace(' ', '-')}).replace(/^\s+/, '');

        return new Handlebars.SafeString(output);
    });
};