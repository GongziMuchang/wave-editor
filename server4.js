var app = require('http').createServer(handler)
//var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var url = require('url');
//var wav = require('wav');

app.listen(3000);
console.log('http server port 3000');

function fileSize(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}



function handler (request, response)
{
console.log('request starting...');
var method = request.method;
var query = url.parse(request.url,true).query;
var jsonStr = JSON.stringify(query);
var key_value_array = JSON.parse(jsonStr);
var keys = Object.keys(key_value_array);

console.log(jsonStr);
console.log(method);
// respond
// response.write("json string = " + jsonStr + "\n");

// If post.
   if(method == "POST")
   {
            var postData = '';

            // Get all post data when receive data event.
            request.on('data', function (chunk) {

                postData += chunk;

            });

            // When all request post data has been received.
            request.on('end', function () {

                console.log("Client post data : " + postData);

                // Parse the post data and get client sent username and password.
                // var postDataObject = JSON.parse(postData);

                //var userName = postDataObject.user_name;

                //var password = postDataObject.password;

                // response.writeHead(200, {'Access-Control-Allow-Origin':'*'});

                /*if('jerry' == userName && '666666' == password)
                {
                    response.end('User name and password is correct. ');
                }else
                {
                    response.end('User name and password is not correct. ');
                }
                */
                response.end('got your data!');

		var fs = require('fs');

		var stream = fs.createWriteStream("my_file.txt");

		stream.once('open', function(fd)
		{
  			stream.write(postData);

  			stream.end();
		});
            })
    }
    else if(method == "GET")
    {
     if(keys.length > 0)
     {
      for (var i = 0; i < keys.length; i++)
      {
        if(keys[i] == 'hinput')
        {

          var humanInput = key_value_array['hinput'];
	  console.log("Human input: " + humanInput);

	  /*
          var util = require('util');
	  var exec = util.promisify(require('child_process').exec);

	  async function myServerFunction()
          {
		var { stdout, stderr } = await exec(cmd);

		response.write(stdout);
		response.end();
	  }

	  myServerFunction();
	  */

 	  var spawn = require('child_process').spawn,
          py    = spawn('python', ['robot/dialog-agent.py']),
          dialogStr = '';

          py.stdin.write(humanInput + '\n');

	  console.log('wrote human input to python');

          py.stdin.end();

	  console.log('wrote end to python');

          py.stdout.on('data', function(data){
                 dialogStr += data.toString();
          });

          py.stdout.on('end', function(){
                console.log('Received from dialog: ',dialogStr);
                // client.send(recognition + ' : ' + dialogStr);
		response.write(dialogStr);
		response.end();
                console.log('sent to server: '+ dialogStr);
          });

        }
	else
	if(keys[i] == 'runGetFilesJavaCommand')
     	{
      		var util = require('util'), exec = util.promisify(require('child_process').exec);

		async function myServerFunction()
          	{
			var { stdout, stderr } = await exec(key_value_array['runGetFilesJavaCommand']);
			var { stdout, stderr } = await exec("python run.py");

			response.write(stdout);
			response.end();
		}

	  	myServerFunction();
	}
	else
	if(keys[i] == 'runGetAssociationsJavaCommand')
	{
      		var util = require('util'), exec = util.promisify(require('child_process').exec);

		async function myServerFunction2()
          	{
			var { stdout, stderr } = await exec(key_value_array['runGetAssociationsJavaCommand']);

			response.write(stdout);
			response.end();
		}

	  	myServerFunction2();
	}
	else
	if(keys[i] == 'runGetAssociations2Java')
	{
      		var util = require('util'), exec = util.promisify(require('child_process').exec);

		async function myServerFunction3()
          	{
			var { stdout, stderr } = await exec(key_value_array['runGetAssociations2Java']);

			response.write(stdout);
			response.end();
		}

	  	myServerFunction3();
	}
	else
	if(keys[i] == 'runGetAssociations3Java')
	{
      		var util = require('util'), exec = util.promisify(require('child_process').exec);

		async function myServerFunction3()
          	{
			var { stdout, stderr } = await exec(key_value_array['runGetAssociations3Java']);

			response.write(stdout);
			response.end();
		}

	  	myServerFunction3();
	}
	else
        if(keys[i] == 'cmd')
        {
          console.log("Running cmd: " + cmd);
          var cmd = key_value_array['cmd'];
          // response.write("<note> <to>A</to> <from>B</from> <title>hi</title> <message>how are you</message></note>");
          response.write("from server: you want to run: " + cmd);
          response.end();
        }
        else
        if(keys[i] == 'file')
        {
          console.log("Asking For File!");
          // Get user requested file name.
          var fileName = key_value_array['file'];
          console.log("File Name = " + fileName);
          // fileName = fileName.substr(1);

          // Read the file content and return to client when read complete.

          fs.readFile(fileName, {encoding:'utf-8', flag:'r'}, function (error, data) {

              if(!error)
              {
                  // console.log(data);
                  // response.writeHead(200, {'Access-Control-Allow-Origin':'*'});
                  response.write(data);
                  response.end();
              }else
              {
                  // response.writeHead(404, {'Access-Control-Allow-Origin':'*'});
                  response.end(JSON.stringify(error));
              }
          });

       }
     }
   }
   else
   {
     console.log("send webpage: " + request.url);
     if(request.url == '/')
     {
	readFile = '/audio-load-play.html';
     }
     else
     {
	readFile = request.url;
     }
     console.log(readFile);

     fs.readFile(__dirname + readFile,
     function (err, data) {
       if (err) {
         response.writeHead(500);
         return response.end('Error loading the' + readFile);
       }

       response.writeHead(200);
       response.end(data);
     });
  }
 }

}


/*
function handler (req, res) {
  fs.readFile(__dirname + '/audio-recorder-2bt.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading audio-recorder.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
*/

// Start Binary.js server
//var server = BinaryServer({port: 9000});
//console.log('binary server port 9000...');
var customerId = 0;

// Wait for new user connections
/*
server.on('connection', function(client){
  console.log('new client...');
  var this_customer_id = ++customerId;
  var utt_id = 0;

  var file = fs.createReadStream(__dirname + '/robot.jpeg');
  client.send(file);

  client.on('stream', function(stream, meta) {
    console.log('new stream');
    utt_id++;
    var outFile = 'customer_' + this_customer_id + '_utt_' + utt_id + '.wav';
    var fileWriter = new wav.FileWriter(outFile,
    {
        channels: 1,
        sampleRate: 16000,
        bitDepth: 16
    });
    stream.pipe(fileWriter);

    stream.on('error', function(ex) {
      console.log("stream handled error");
      console.log(ex);
    });

    stream.on('end', function()
    {
      fileWriter.end();
      console.log('wrote to file ' + outFile);

      var oldsize = 0;
      var recognition;
      var arr;
      var intv = setInterval(function()
      {
        var size = fileSize(outFile);
        console.log('file size: ' + size);
        console.log('oldfile size: ' + oldsize);

        if(size > 0 && oldsize > 0 && size == oldsize)
        {
          clearInterval(intv);

          const util = require('util');
          const exec = util.promisify(require('child_process').exec);
          //const { exec } = require('child_process');
          var cmd = 'cp ' + outFile + ' ~/kaldi-gpu/egs/commonvoice/s5/data/valid_test/split1/1/recording.wav; cd ~/kaldi-gpu/egs/commonvoice/s5; ./run-test ';
          // var cmd = 'ls -l ';
          console.log(cmd);

          async function asr()
          {
            const { stdout, stderr } = await exec(cmd);
            //console.log('stderr:', stderr);
            arr = stderr.split(" ");
            if(arr.length > 9)
            {
              recognition = '';
              for(var i = 8; i < arr.length; i++)
                recognition += (arr[i] + " ");
              console.log("Recognition: " + recognition);

              var spawn = require('child_process').spawn,
              py    = spawn('python', ['nodejs-python-comm/dialog-agent.py']),
              dialogStr = '';

              py.stdin.write(recognition);
              py.stdin.end();

              py.stdout.on('data', function(data){
                 dialogStr += data.toString();
              });

              py.stdout.on('end', function(){
                 console.log('Received from dialog: ',dialogStr);
                 client.send(recognition + ' : ' + dialogStr);
                 console.log('sent to server: '+ dialogStr);
              });
            }
            else
            {
              recognition = 'please speak again';
              console.log("Recognition: " + recognition);
              client.send('nil' + ' : ' + recognition);
              console.log('sent to server: '+ recognition);
            }
          }
          asr();

        }
        else
        {
           oldsize = size;
        }
      }, 100);

    });
  });

  client.on('error', function(ex) {
    console.log("client handled error");
    console.log(ex);
  });

  //var txt = ' hi client ' + customerId + ' utterance ' + utt_id;
  //client.send(txt);

});
*/

