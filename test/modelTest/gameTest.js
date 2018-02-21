const assert = require("chai").assert;
const Game = require("../../src/models/game.js");
const Spy=require('../../src/models/spy.js');
const Bomb=require('../../src/models/bomb.js');

describe("Game", () => {
  let game = {};
  beforeEach(
    () => {
      game = new Game("gameId");
    }
  );
  describe("Game.getPlayers()", () => {
    it("Game.getId() should return game id", () => {
      assert.equal(game.getId(), "gameId");
    });
  });
  describe("Game.getPlayers()", () => {
    it("should return empty array when game has no players", () => {
      assert.deepEqual(game.getPlayers(), []);
    });
    it("should return players array when game has players", () => {
      game.addPlayer("ravi", 0, 'red');
      assert.deepEqual(game.getPlayers(), [{
        name: "ravi",
        id: 0,
        color: 'red'
      }]);
    });
  });
  describe("Game.addPlayer()", () => {
    it("Game.addPlayer() should return game id", () => {
      let expectedOutput = {
        name: "Ravi",
        id: 0,
        color: "red"
      };
      let actual = game.addPlayer("Ravi", 0, "red");
      assert.deepEqual(actual, expectedOutput);
    });
  });
  describe('Game.getPlayerName()', () => {
    beforeEach(
      () => {
        game.addPlayer("ravi",12345,'red');
        game.addPlayer("ankur",123456,'blue');
      }
    );
    it('should return first player name for red color team', () => {
      assert.equal(game.getPlayerName("red"), "ravi");
    });
    it('should return first player name for blue color team', () => {
      assert.equal(game.getPlayerName("blue"), "ankur");
    });
  });
  describe('setBattlefield', () => {
    it('should set the battlefield for a player', () => {
      game.setBattlefieldFor(0, {'0_0': 'F'});
      game.setBattlefieldFor(1, {'3_7': 'B'});
      let actual = game.getBattlefieldFor(0);
      let expected = {'0_0': 'F','3_7': 0,'4_2': 'X','4_3': 'X','4_6': 'X',
        '4_7': 'X','5_2': 'X','5_3': 'X','5_6': 'X','5_7': 'X'};
      assert.deepEqual(actual, expected);
      actual = game.getBattlefieldFor(1);
      expected = {'0_0': 0,'3_7': 'B','4_2': 'X','4_3': 'X','4_6': 'X',
        '4_7': 'X','5_2': 'X','5_3': 'X','5_6': 'X','5_7': 'X'};
      assert.deepEqual(actual, expected);
    });
  });
  describe('Game.getPlayerColorBy()', () => {
    beforeEach(
      () => {
        game.addPlayer("ravi",12345,'red');
        game.addPlayer("ankur",123456,'blue');
      }
    );
    it('should return team color of given playerId', () => {
      assert.equal(game.getPlayerColorBy(12345), "red");
    });
    it('should return team color of given playerId', () => {
      assert.equal(game.getPlayerColorBy(123456), "blue");
    });
  });
  describe('Game.getPlayerIndexBy()', () => {
    beforeEach(
      () => {
        game.addPlayer("ravi",12345,'red');
        game.addPlayer("ankur",123456,'blue');
      }
    );
    it('should return index of player given playerId', () => {
      assert.equal(game.getPlayerIndexBy(12345),0);
    });
    it('should return index of player given playerId', () => {
      assert.equal(game.getPlayerIndexBy(123456),1);
    });
  });
  describe('Game.getPotentialMoves()', () => {
    beforeEach(
      () => {
        game.addPlayer("ravi",0,'red');
        game.addPlayer("ankur",1,'blue');
        let redArmyPos = {'3_2':'S','3_1':'B'};
        let blueArmyPos = {'3_5':'2','4_1':'B','3_3':'S'};
        game.setBattlefieldFor(0,redArmyPos);
        game.setBattlefieldFor(1,blueArmyPos);
      }
    );
    it('should give potential moves for a piece', () => {
      let actualOutput = game.getPotentialMoves(0,'3_2');
      let expectedOutput = {
        freeMoves:['4_2','2_2'],
        attackMoves: ['3_3']
      };
      assert.deepEqual(actualOutput,expectedOutput);
    });
    it('should give potential moves for a piece', () => {
      let actualOutput = game.getPotentialMoves(0,'3_1');
      let expectedOutput = {
        freeMoves:["2_1",'3_0'],
        attackMoves: ['4_1']
      };
      assert.deepEqual(actualOutput,expectedOutput);
    });
  });
  describe('updatePieceLocation',()=>{
    beforeEach(() => {
      game = new Game("gameId");      
      game.addPlayer("ravi",0,'red');
      game.addPlayer("ankur",1,'blue');
      let redArmyPos = {'3_2':'S','3_1':'B'};
      let blueArmyPos = {'3_5':'2','4_1':'B','3_3':'S'};
      game.setBattlefieldFor(0,redArmyPos);
      game.setBattlefieldFor(1,blueArmyPos);
    });
    it('should add given location as a last selected location',()=>{
      assert.isNotOk(game.battlefield.hasLastSelectedLoc());
      game.updatePieceLocation('3_2');
      assert.isOk(game.battlefield.hasLastSelectedLoc());
    });
    it('should replace piece location with given location',()=>{
      let spy = new Spy();
      game.updatePieceLocation('3_2');
      assert.isOk(game.battlefield.hasLastSelectedLoc());
      game.updatePieceLocation('2_2'); 
      assert.deepEqual(game.battlefield.getPiece(0,'2_2'),spy);
    });
    it('should not replace piece location with invalid location',()=>{
      let spy = new Spy();
      game.updatePieceLocation('3_2');
      assert.isOk(game.battlefield.hasLastSelectedLoc());
      game.updatePieceLocation('5_2'); 
      assert.deepEqual(game.battlefield.getPiece(0,'5_2'));
      assert.deepEqual(game.battlefield.getPiece(0,'3_2'),spy);
    });
    it('should not move Bomb piece',()=>{
      let bomb = new Bomb();
      game.updatePieceLocation('3_1');
      assert.isNotOk(game.battlefield.hasLastSelectedLoc());
      game.updatePieceLocation('3_1'); 
      assert.deepEqual(game.battlefield.getPiece(0,'2_1'));
      assert.deepEqual(game.battlefield.getPiece(0,'3_1'),bomb);
    });
  });
});
