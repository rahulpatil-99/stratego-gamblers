const assert = require('chai').assert;
const request = require('supertest');
const app = require('../../app.js');
const Game = require("../../src/models/game");
describe('app', () => {
  describe("GET /index.html", () => {
    it("responds with home page", done => {
      request(app)
        .get("/index.html")
        .expect(200)
        .expect(/Stratego/)
        .expect(/Enter Your Name/)
        .expect(/START BATTLE/)
        .expect("Content-Type", "text/html; charset=UTF-8")
        .end(done);
    });
  });
  describe('POST /setup/player/0', () => {
    beforeEach(
      () =>{
        validPieceWithLoc = ['3_2=2','3_9=B','2_3=2','2_6=B','1_1=S',
          '1_4=9','1_5=1','1_6=3','1_8=3','0_0=F','0_1=10'].join('&');
      }
    );
    it("should return status with missing piece", done => {
      request(app)
        .post('/setup/player/0')
        .send('0_0=4')
        .expect(206)
        .expect(/pieces or location missing!/)
        .end(done);
    });
    it("should set army for given player and return status with OK", done => {
      request(app)
        .post('/setup/player/0')
        .send(validPieceWithLoc)
        .expect(200)
        .end(done);
    });
  });
  describe('POST /setup/player/1', () => {
    beforeEach(()=>{
      validPieceWithLoc = ['3_2=2','3_9=B','2_3=2','2_6=B','1_1=S',
        '1_4=9','1_5=1','1_6=3','1_8=3','0_0=F','0_1=10'].join('&');
    });
    it("should set army for another player and responds with OK", done => {
      request(app)
        .post('/setup/player/1')
        .send(validPieceWithLoc)
        .expect(200)
        .end(done);
    });
  });
  describe('SetupPage', () => {
    beforeEach(() => {
      app.game = new Game();
      app.game.addPlayer("player1");
      app.game.addPlayer("player2");
    });
    describe('GET /setupRedArmy', () => {
      it("should render setup page for player1", done => {
        request(app)
          .get('/setupRedArmy')
          .expect(200)
          .expect(/setupRedArmy.js/)
          .expect(/player1/)
          .end(done);
      });
    });
    describe('GET /setupBlueArmy', () => {
      it("should render setup page for player2", done => {
        request(app)
          .get('/setupBlueArmy')
          .expect(200)
          .expect(/setupBlueArmy.js/)
          .expect(/player2/)
          .end(done);
      });
    });
  });
  describe('GET /createGame/:name', () => {
    it("responds with sharing key", done => {
      request(app)
        .get('/createGame/ravi')
        .expect(200)
        .expect("1")
        .expect("Content-Type", "text/html; charset=utf-8")
        .end(done);
    });
  });
  describe('GET /isOpponentReady', () => {
    it("returns true if opponent is ready", done => {
      request(app)
        .get('/isOpponentReady')
        .expect(200)
        .expect("false")
        .end(done);
    });
  });
  describe('POST /joinGame', () => {
    it("redirect joining player to home if game is not created ", done => {
      app.game = undefined;
      request(app)
        .post('/joinGame')
        .send("name=ankur&gameid=1")
        .expect(302)
        .expect("Location","/")
        .end(done);
    });
    beforeEach(() => {
      app.game = new Game(1);
      app.game.addPlayer("player1");
    });
    it("redirect valid joining player to battlefield", done => {
      request(app)
        .post('/joinGame')
        .send("name=ankur&gameid=1")
        .expect(302)
        .expect("Location","/setupBlueArmy")
        .end(done);
    });
    it("redirect invalid joining player to home", done => {
      request(app)
        .post('/joinGame')
        .send("name=ankur&gameid=2")
        .expect(302)
        .expect("Location","/")
        .end(done);
    });
    it('redirect third joining player to home', done => {
      app.game.addPlayer("player2");
      request(app)
        .post('/joinGame')
        .send("name=ankur&gameid=1")
        .expect(302)
        .expect("Location","/")
        .end(done);
    });
  });
  describe('GET /isOpponentReady', () => {
    beforeEach(
      () => {
        app.game = new Game(1);
        app.game.addPlayer("player1");
      }
    );
    it("returns false if opponent is not ready", done => {
      request(app)
        .get('/isOpponentReady')
        .expect(200)
        .expect("false")
        .end(done);
    });
    it("returns true if opponent is ready", done => {
      app.game.addPlayer("player2");
      request(app)
        .get('/isOpponentReady')
        .expect(200)
        .expect("true")
        .end(done);
    });

  });
});
