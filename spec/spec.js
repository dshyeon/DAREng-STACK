var request = require('supertest');
var mongoose = require('mongoose');
describe('Server Unit Tests', function () {
  var server;
  beforeEach(function () {
    server = require('./../server/server.js');
  });
  it('responds to /', function testSlash(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
  it('responds to nonexistent path with 404', function testSlash(done) {
    request(server)
      .get('/foobar')
      .expect(404, done);
  });
  // it('responds to /images', function testPath(done) {
  //   console.log('test image route')
  //
  //   request(server)
  //     .get('/images')
  //     .expect(302, done);
  // });
});

describe('database Unit Tests', function () {
  var server;
  beforeEach(function () {
    db = require('../database/index.js');
  });
  it('posts image to db working', function testPath(done) {
    console.log('test image route')
    var pic = {
      id: '5',
      imageUrl: 'http://imgur.com/gallery/jtjT0',
      geoLocation: [-122.48, 37.78]
    }
    // request(server)
    db.saveImage(pic.imageUrl, pic.geoLocation);
    db.findNear(pic.geoLocation, (err, results) => {
      expect(results).to.exist;
    });
    done();
  });
  it('get images from database works', function testSlash(done) {
    request(server)
      db.findNear([-122.48, 37.78], (err, result) => {
        expect(err).to.exist;
      })
      db.saveImage('www.this.com', [0,0]);
      db.findNear([0,0], (err, results) => {
        expect(results).to.exist;
      });
      done();
  });
  it('gets images within the correct radius', function testPath(done) {
    var pic = {
      id: '5',
      imageUrl: 'http://imgur.com/gallery/jtjT0',
      geoLocation: [-122.48, 37.78]
    }
    // request(server)
    db.saveImage(pic.imageUrl, [-122.48, 37.78]);
    db.saveImage(pic.imageUrl, [-122.5, 37.8]);
    db.saveImage(pic.imageUrl, [-122.4, 37.7]);
    db.saveImage(pic.imageUrl, [-140, 30]);

    db.findNear(pic.geoLocation, (err, results) => {
      expect(results.length).to.equal(3);
    });
    done();

  });
});

describe('Node Server to Database connection tests', function () {
  var db;
  beforeEach(function () {
    mongoose.connect('mongodb://localhost/fetcher');
    db = mongoose.connection;
    var userSchema = mongoose.Schema({
      userName: String,
      id: Number,
      hashPass: String,
      salt: String,
      voteCount: Number
    });

    var imageSchema = mongoose.Schema({
      id: String,
      userId: Number,
      imageUrl: String,
      caption: String,
      geoLocation: String,
      tags: Array,
      timeStamp: String,
      comments: Array,
      voteCount: Number,
    });
    var User = mongoose.model('User', userSchema, 'users');
    var Image = mongoose.model('Image', imageSchema, 'images');
  });
  afterEach(function() {
    db.end();
  })
  it('responds to get images request with array', function testSlash(done) {
    request(db)
      .get('/images')
      .expect(res.body);
  });
  it('responds to /images', function testPath(done) {
    console.log('test image route')
    request(server)
      .get('/images')
      .expect(302, done);
  });
  it('responds to /login', function testPath(done) {
    console.log('test login route')
    request(server)
      .get('/login')
      .expect(302, done);
  });
  it('responds to /signup', function testPath(done) {
    console.log('test signup route')
    request(server)
      .get('/signup')
      .expect(302, done);
  });
});
