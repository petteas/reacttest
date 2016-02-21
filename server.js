/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var shortid = require('shortid');
var mongoose = require("mongoose");
var Patient;
var Doctor;
var Reading;

/*Heroku*/
    mongoose.connect('mongodb://heroku_9sn4dpcl:ilqm8de0tqq51c7th5mlrnlhql@ds059185.mongolab.com:59185/heroku_9sn4dpcl');

/*Localhost*/

/*mongoose.connect('mongodb://localhost:27017');*/

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  console.log("Connected biatch!");
    var Schema = mongoose.Schema;

    var patientSchema = new Schema({
        id    : String,
        name     : String,
        doctorId : String
    });
    var doctorSchema = new Schema({
        id    : String,
        name     : String
    });
    var readingSchema = new Schema({
        id    : String,
        date: Date,
        patientId : String,
        glucoseValue : Number,
        sugarValue: Number
    });

    Patient = mongoose.model('Patient', patientSchema);
    Doctor = mongoose.model('Doctor', doctorSchema);
    Reading = mongoose.model('Reading', readingSchema);
    var petter = new Patient({ id: shortid.generate(), name: 'Petter',doctorId: shortid.generate() });
    console.log("Petters name is:");
    console.log(petter.name); // 'Silence'
    petter.save(function (err, petter) {
        if (err) return console.error(err);
        console.log("Save Success");
        console.log(petter.name);
    });
    Patient.find(function (err, patients) {
        if (err) return console.error(err);
        console.log(patients);
    })
});
var COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


app.get('/api/getdoctors', function(req, res) {
    console.log("Recceived call to get all doctors");
    Doctor.find(function (err, doctors) {
        if (err) return console.error(err);
        console.log(doctors);
        res.send(JSON.stringify(doctors));
    })

});

app.post('/api/getpatientfordoctor', function(req, res) {
    var doctorId = req.query.doctorid;
    console.log("Recceived call to get all patients for a specific doctor");
    Patient.find({ doctorId: doctorId },function (err, patients) {
        if (err) return console.error(err);
        console.log(patients);
        res.send(JSON.stringify(patients));
    })

});

app.post('/api/getreadingsforpatient', function(req, res) {
    var patientId = req.query.patientid;
    console.log("Recceived call to get all readings for a specific patient");
    Reading.find({ patientId: patientId },function (err, readings) {
        if (err) return console.error(err);
        console.log(readings);
        res.send(JSON.stringify(readings));
    })

});

app.post('/api/createpatient', function(req, res) {
    console.log("Recceived Create Patient-call");
    var name = req.query.name;
    var doctorId = req.query.doctorid;
    console.log(name);
    console.log(doctorId);
    var ID = shortid.generate();
    res.setHeader('Content-Type', 'application/json');
    var patient = new Patient({ id: ID, name: name,doctorId: doctorId });
    console.log("patient name is:");
    console.log(patient.name); // 'Silence'
    patient.save(function (err, patient) {
        if (err) return console.error(err);
        console.log("Save Success");
        console.log(patient.name);
        res.send(JSON.stringify({id: ID}));
    });
});

app.post('/api/createdoctor', function(req, res) {
    console.log("Recceived Create Doctor-call");
    var name = req.query.name;
    console.log(name);
    var ID = shortid.generate();
    res.setHeader('Content-Type', 'application/json');
    var doctor = new Doctor({ id: ID, name: name});
    console.log("doctor name is:");
    console.log(doctor.name); // 'Silence'
    doctor.save(function (err, doctor) {
        if (err) return console.error(err);
        console.log("Save Success");
        console.log(doctor.name);
        res.sendStatus(200);
    });
});

app.post('/api/assignpatienttodoctor', function(req, res) {
    var patientId = req.query.patientid;
    var doctorId = req.query.doctorid;
    console.log("Recceived call to assign patient to doctor");
    Patient.find({ id: patientId },function (err, patients) {
        if (err) return console.error(err);
        console.log(patients);
        if(patients.length == 0){
            return console.error(err);
        }
        var patient = patients[0];
        patient.doctorId = doctorId;
        patient.save(function (err, patient) {
            if (err) return console.error(err);
            console.log(patient.doctorId);
            res.sendStatus(200);
        });

    })

});

app.post('/api/createReading', function(req, res) {
    console.log("Recceived Create Reading-call");
    var patientId = req.query.patientid;
    var glucoseValue = req.query.glucosevalue;
    var sugarValue = req.query.sugarvalue;
    var ID = shortid.generate();
    res.setHeader('Content-Type', 'application/json');
    var reading = new Reading({ id: ID, date: Date.now(),patientId: patientId,glucoseValue:glucoseValue,sugarValue:sugarValue });
    console.log("reading glucosevalue is:");
    console.log(reading.glucoseValue); // 'Silence'
    reading.save(function (err, reading) {
        if (err) return console.error(err);
        console.log("Save Success");
        res.sendStatus(200);
    });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
