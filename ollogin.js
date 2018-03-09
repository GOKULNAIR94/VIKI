module.exports = function ( req, res, callback){
    var https = require('https');
    
    
    try {
        var varPath = "/salesApi/resources/latest/VikiAuth_c?q=UserId_c=" + userid + "&onlyData=true"
        console.log("varPath Login : " + varPath);
        var options = {
            host: 'acs.crm.ap2.oraclecloud.com',
            path: varPath,
            headers: {
                'Authorization': req.body.headers.authorization
            }
        };
        var responseString = '',
            resObj;
        var request = https.get(options, function(resx) {
            resx.on('data', function(data) {
                responseString += data;
            });
            resx.on('end', function() {
                try {
                    callback( resObj );
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