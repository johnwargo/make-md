#!/usr/bin/env node

/* jshint node: true, strict: true, undef: true, unused: true */

//========================================================================
// Make-MD
//
// Node module that creates an empty .md file in the current folder
//
// by John M. Wargo (www.johnwargo.com)
//========================================================================

"use strict";

var exec = require('child_process').exec,
  fs = require('fs'),
  os = require('os'),
  path = require('path');

//Used to write a carriage return to the output file
var slashN = '\n';

//=================================
// Launch file
//=================================
function launchFile(theFile) {
  //Used to build the command string to launch the readme file
  var cmdStr;
  //What OS are we running on?
  if (os.type().indexOf('Win') === 0) {
    //Are we running on Windows? then use start
    cmdStr = 'start ' + theFile;
  } else {
    //OS X or Linux, use open
    //cmdStr = 'open ./' + fileName;
    //Added the -e to help this work better on Linux
    cmdStr = 'open -e ./' + theFile;
  }
  console.log("Launching %s", theFile);
  var child = exec(cmdStr, function (error, stdout, stderr) {
    if (error !== null) {
      console.log("\nexec error: %s\n".error, error);
      process.exit(1);
    }
  });
}

//=================================
// Processing starts
//=================================
//Sort out the command line arguments
var fileName;
var userArgs;
//Is the first item 'node' or does it contain node.exe? Then we're testing!
//Yes, I could simply look for the word 'node' in the first parameter, but these
//are two specific cases I found in my testing, so I coded specifically to them.
if (process.argv[0].toLowerCase() === 'node' || process.argv[0].indexOf('node.exe') > -1) {
  //whack the first two items off of the list of arguments
  //This removes the node entry as well as the JavaScript file name (the
  //node program we're running)
  userArgs = process.argv.slice(2);
} else {
  //whack the first item off of the list of arguments
  //This removes just the make-readme.js entry
  userArgs = process.argv.slice(1);
}
//Figure out the header (title) for the readme file
//Do we have anything on the command line?
fileName = userArgs.length > 0 ? userArgs[0] : 'readme.md';
//Does the file end in .md?
var fileName = path.extname(fileName.toLowerCase()) === '.md' ? fileName : fileName + '.md';
var theHeading = fileName.toUpperCase();

//Calculate the readme file name, always use the current folder
var theFile = path.join(process.cwd(), fileName);
//Does the file already exist?
if (!fs.existsSync(theFile)) {
  //Make a line of equal signs that match the lengh of the header
  var theEqualSigns = new Array(theHeading.length + 1).join("=");
  //Now create the file
  var wstream = fs.createWriteStream(theFile);
  //Create the finish event that fires after the write completes
  wstream.on('finish', function () {
    console.log("Created: %s", theFile);
    //Now that we've created the file, launch it...
    launchFile(theFile);
  });
  //Write some stuff to the file
  //First the name of the folder we're in
  wstream.write(theHeading + slashN);
  //Next a line of equal signs (=) to set the title as a heading
  wstream.write(theEqualSigns + slashN);
  //A couple of blank lines
  wstream.write(slashN + slashN);
  //Horizontal rule
  wstream.write("***" + slashN + slashN);
  //shameless plug
  wstream.write("Created by make-md by [John M. Wargo](http://www.johnwargo.com)");
  //close the file
  wstream.end();
} else {
  console.log('Found existing file: "%s"', fileName);
  //go ahead and launch the existing file
  launchFile(theFile);
}