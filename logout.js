module.exports = function ( recordId, req, res, callback){
    var https = require('https');
    var userid = "";
    try {
        var varPath = "/salesApi/resources/latest/TestKaaman1/" + recordId;
        console.log("varPath Login : " + varPath);
        var options = {
            "method": "DELETE",
            host: 'acs.crm.ap2.oraclecloud.com',
            path: varPath,
            headers: {
                'Authorization': req.body.headers.authorization
            }
        };
        
        var request = https.get(options, function(resx) {
            resx.on('data', function(data) {
                
            });
            resx.on('end', function() {
                try {
                    console.log( "Status Code : " + resx.statusCode );
                    callback( req, res, resx.statusCode );
                    
                } catch (error) {
                    console.log("Error: " + error);
                }
            });
            resx.on('error', function(e) {
                console.log("Got error: " + e.message);
                speech = "Something went wrong! Please try again later!";
                res.json({
                  speech: speech,
                  displayText: speech
                });
            });
        });
    } catch (e) {
        console.log("No Og req : " + e);
    }
    
}