var fs = require('fs');
var http = require('http');
var soap = require('soap');
var express = require('express');


var calls = [];

var url_in_wsdl = 'http://localhost';
var url = process.env.URL || 'http://localhost:8080';
var port = process.env.PORT || 8080;
console.log('URL: ' + url + ', PORT: ' + port);

var authService = {
    SforceAuthenticationService: {  // service <service name="SforceAuthenticationService">
        AuthenticationService: {  // binding <port binding="tns:AuthenticationBinding" name="AuthenticationService">
            Authenticate: function(args) {  // operation <operation name="Authenticate">
                console.log("Authenticate");
                console.log(args);

                var value;
                if (args.username.split('@')[0] === args.password) {
                    value = true;
                } else {
                    value = false;
                }
                return {
                    Authenticated: value
                };
            }
        }
    } 
};


var app = express();
app.use(express.static('static'));

app.get('/', function(req, res) {
    res.render('index', {calls: calls, url: url, port: port});
});

function wrapService(service) {
    var wrappedService = {};
    for(var portTypeKey in service) {
        var portType = service[portTypeKey];
        var wrappedPortType = {};
        wrappedService[portTypeKey] = wrappedPortType;

        for(var bindingKey in portType) {
            var binding = portType[bindingKey];
            var wrappedBinding = {};
            wrappedPortType[bindingKey] = wrappedBinding;

            for(var operationKey in binding) {
                var operation = binding[operationKey];

                if(typeof operation === 'function') {
                    console.log(">>>>> " + operationKey);
                    wrappedBinding[operationKey] = wrapOperation(operationKey, operation);                    
                }
            }
        }
    }
    return wrappedService;


    function wrapOperation(operationKey, operation) {
        return function(args) {
            console.log(args);
            var result = operation(args);
            calls.push({ 
                time: (new Date()).toISOString(), 
                operation: operationKey, 
                input: args, 
                output: result 
            });
            return result;
        };
    }
}

var server = http.createServer(app);
server.listen(port);

var authWsdl = fs.readFileSync('./AuthenticationService.wsdl', 'utf8').replace(url_in_wsdl, url);
console.log(authWsdl);

var soapOptions = {
    ignoredNamespaces: {
        namespaces: ['test'],
        override: true
    }
};

soap.listen(server, '/SforceAuthenticationService', wrapService(authService), authWsdl, soapOptions);

