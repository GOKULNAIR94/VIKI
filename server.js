'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https');
var fs = require('fs');
restService.use(bodyParser.urlencoded(
{
    extended: true
}));
restService.use(bodyParser.json());
    var myContext = 'start';
    var titleName = '';
    var tNumber = '';
    var territoryStored = '';
    var uname = 'gokuln';
    var pword = 'Goklnt@1';
    var speech = '';
    var options='';
    var urlPath='';
    var request;
    var responseString;
    var resCode = '';
    var resObj = '';
  
restService.post('/inputmsg', function(req, res) 
{
  titleName = req.body.result.parameters.titleName;
  territoryStored = req.body.result.parameters.territoryStored;
  if( territoryStored != null )
     myContext = 'multiTerritory';
    
  console.log(titleName);
  
  switch( myContext )
  {
    case "start":
    
      Start();
      break;
      
    case "multiTerritory":
      MultiTerritory()
      break;
  }
      
function Start()
{
  urlPath='/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=' + encodeURIComponent(titleName) + '&fields=TitleNumber_c'; 
  console.log(urlPath);
  
  options = 
  {
    host: 'cbhs-test.crm.us2.oraclecloud.com',
    path: urlPath,
    headers: 
    {
      'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
    }
  };
  request = http.get(options, function(resg)
    {
        responseString = "";
        resg.on('data', function(data) 
    {
      responseString += data;
    });
        resg.on('end', function() 
        {
            resCode = responseString;
            try
            {
                resObj = JSON.parse(resCode);
        //console.log(resObj);               
                tNumber = resObj.items[0].TitleNumber_c;
        console.log(tNumber);
            }
            catch (error)
            {
                return res.json
                ({
                    speech: 'Incorrect title name'
                })
               console.log('Got ERROR');
            }
              
            if( territoryStored == null)
                urlPath='/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c='+ tNumber + '&fields=RecordName,Id'; 
            else
                urlPath='/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c='+ tNumber + ';TerritoryStored_c='+territoryStored+'&fields=RecordName,Id'; 
    
            console.log( urlPath );
            
            options = 
            {
              host: 'cbhs-test.crm.us2.oraclecloud.com',
              path: urlPath,
              headers: 
              {
                'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
              }
            };
            
        request = http.get(options, function(resx)
        {
          responseString = "";
          resx.on('data', function(data) 
          {
            responseString += data;
          });
          resx.on('end', function() 
          {
            resObj=JSON.parse(responseString);
            //tNumber=resObj.items[0].TitleNumber_c;
            //console.log(resObj);
            var promoCount = resObj.count
            console.log( "promoCount : " + promoCount);
            speech = "";
            speech= 'There are ' + promoCount + ' promotion(s) for the Title ' + titleName + "\n Please select a region of the Promotion of the Title";
            var pId, pName;
            for( var i =0; i< promoCount; i++)
            {
              pId = resObj.items[i].Id;
              pName = resObj.items[i].RecordName;
              speech = speech + "\n\n" + parseInt(i+1,10) + ". " + pId + " - " + pName;
              if( i == promoCount - 1 )
                speech = speech + ".";
              else
                speech = speech + ",";  
            }
            //speech= 'There are ' + promoCount + ' promotions for the Title ' + titleName;
            console.log(speech);
            return res.json
                  ({
                      speech: speech,
                      displayText: speech,
                      //source: 'webhook-OSC-oppty'
                  })
          });
          resx.on('error', function(e) 
          {
            console.log("Got error: " + e.message);
          });
        });
        })
    
        resg.on('error', function(e) 
        {
            console.log('Got error: ' + e.message);
        });
    }); 
  
}
function MultiTerritory(){
  urlPath='/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c='+ tNumber + ';TerritoryStored_c='+territoryStored+'&fields=RecordName,Id'; 
  options = 
          {
            host: 'cbhs-test.crm.us2.oraclecloud.com',
            path: urlPath,
            headers: 
            {
              'Authorization': 'Basic ' + new Buffer( uname + ':' + pword ).toString('base64')
            }
          };
  var pId, pName;
  request = http.get(options, function(resx)
        {
          responseString = "";
          resx.on('data', function(data) 
          {
            responseString += data;
          });
          resx.on('end', function() 
          {
          
            resObj=JSON.parse(responseString);
            
            
            
            pId=resObj.items[i].Id;
            pName=resObj.items[i].RecordName;
            speech =  pId + " - " + pName;

//            return res.json
//                  ({
//                      speech: speech,
//                      displayText: speech,
//                      //source: 'webhook-OSC-oppty'
//                  })
          });
          resx.on('error', function(e) 
          {
            console.log("Got error: " + e.message);
          });
    
    options.path = "/salesApi/resources/latest/MarketSpend_c?onlyData=true&q=PromotionName_Id_c=" + pId + "&fields=Id,RecordName,Status_c,RequestType_c";
    request = http.get(options, function(resx)
        {
          responseString = "";
          resx.on('data', function(data) 
          {
            responseString += data;
          });
          resx.on('end', function() 
          {
          
            resObj=JSON.parse(responseString);
            var msId, msName;
            var msCount = resObj.count
            console.log( "msCount : " + msCount);
            speech = "";
            speech= 'There are ' + msCount + ' MS(s) for the Title ' + msName + "\n Please select a ms";
            for( var i =0; i< msCount; i++)
            {
              msId = resObj.items[i].Id;
              msName = resObj.items[i].RecordName;
              speech = speech + "\n\n" + parseInt(i+1,10) + ". " + msId + " - " + msName;
              if( i == msCount - 1 )
                speech = speech + ".";
              else
                speech = speech + ",";  
            }
            
            console.log(speech);
            return res.json
                  ({
                      speech: speech,
                      displayText: speech,
                      //source: 'webhook-OSC-oppty'
                  })
          });
          resx.on('error', function(e) 
          {
            console.log("Got error: " + e.message);
          });

        });
    });
  
}
        
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
