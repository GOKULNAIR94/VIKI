module.exports = function ( req, res, callback){
    try {
        if (req.body.originalRequest != null) {
            if (req.body.originalRequest.source == "slack") {
                var userid = req.body.originalRequest.data.event.user;
                console.log("userid : " + userid);
            }
        }
        var varPath = "/salesApi/resources/latest/VikiAuthv1_c?q=UserId_c=" + userid + "&onlyData=true"
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
        var request = http.get(options, function(resx) {
            resx.on('data', function(data) {
                responseString += data;
            });
            resx.on('end', function() {
                try {
                    resObj = JSON.parse(responseString);
                    var rowCount = resObj.count;
                    console.log(rowCount);
                    
                    callback( req, res, rowCount );
                    
                } catch (error) {
                    console.log("Error: " + error);
                }
            });
            resx.on('error', function(e) {
                console.log("Got error: " + e.message);
            });
        });
    } catch (e) {
        console.log("No Og req");
    }
    
}