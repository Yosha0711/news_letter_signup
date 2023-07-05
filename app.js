const requests=require('requests');
const express=require('express');
const bodyparser=require('body-parser');
const https=require('https');

const app =express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));  // to use bodyparse

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html")

});                               //to redirect

app.post("/",function(req,res){
  const firstname = req.body.fname;  // fname is from input in html name
  const lastname = req.body.lname;
  const email = req.body.email;

      const data={                                //this data is for mailchimp background and parameters are showed in mailchimp in POST/Lists/{listid}
        members:[
          {
          email_address:email,
          status:"subscribed",
          merge_fields:{                      //this field is used to store data in mailchimp server like fname and lname
            FNAME:firstname,
            LNAME:lastname,
          }
        }
      ]
      }

      var jsonData=JSON.stringify(data);  //this is going to send to mailchimp

      const url= "https://us14.api.mailchimp.com/3.0/lists/91b2f54191";     //this url is basic of mailchimp and 14 is taken from api refrence last digit and 91b.. is my audience id we have to send it
      const options={
        method:"POST",
        auth:"urvik:67207f5aa7af8cd8a94899f85d009b22-us14"                  //authentication
      }

    const request=  https.request(url,options,function(response){

        if(response.statusCode ===200){                                    //status code if incorrect it will give error(400)

            res.sendFile(__dirname+"/success.html")

                                   //res is from upper function,response is from current function.
        }else{

            res.sendFile(__dirname+"/failure.html")



        }
                                                                           //its request not requests ..its a method of https module
        response.on("data",function(data){
          console.log(JSON.parse(data));                                    //the data send by mail chimp is printed in here
        })
      })

    request.write(jsonData);                                                //write data in server
      request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");                                                          //redirectc to home page
});


app.listen(process.env.PORT || 3000,function(){                                       //process.env.PORT is a dynamic port that herku will define on the go
  console.log("server is running on port 3000!");
})

//67207f5aa7af8cd8a94899f85d009b22-us14
//api key
// 91b2f54191
// audience id
