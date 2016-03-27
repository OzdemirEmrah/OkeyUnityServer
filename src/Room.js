var exports = module.exports = {};
var Mysql = require('./MysqlConnection.js');
var CardStack = require('./CardStack.js');

var Room = function(roomType){

    if (!(this instanceof Room)){
        return new Room();
    }
    var that = {};
    
    var GameIdGenerate = function(){
        var _sym = '1234567890';
        var str = '';
        var date = new Date();
        str += date.getFullYear().toString(); 
        str += date.getDate().toString();
        str += date.getHours().toString();
        str += date.getMinutes().toString();
        str += date.getSeconds().toString();
        for(var i = 0, idLen = 3; i < idLen; i++){
            str += _sym[parseInt(Math.random() * (_sym.length))];
        }

        return str;
    }

    var PlayerIdGenerate = function(){
        var _sym = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        var str = '';
        for (var i =0, idLen = 20; i<idLen; i++){
            str += _sym[parseInt(Math.random() * (_sym.length))];
        }
        return str;
    }

    var gameId = GameIdGenerate();
    var playerId;
    var mysql = new Mysql();
    
    var InsertGameInfo = function(gameId, callback){
        var mysql = new Mysql();
        var cardStack = new CardStack();   
        var data = {
            game_id : gameId,
            cardstack: JSON.stringify(cardStack.__stack),
            p1_id: PlayerIdGenerate(),
        };
        mysql.Insert("game", data, function(err, results){
            if(err) throw err;
            return callback(err, gameId, data['p1_id']);
        });
    }
    
    var InsertPlayerInfo = function(gameId, callback){
        var mysql = new Mysql();
        var cols = ["p1_id", "p2_id", "p3_id", "p4_id"];
        mysql.Select("game", cols, "game_id="+gameId, function(err, results){
            if(err) throw err;
            if(results.length == 0){
                return callback("Wrong game id","");
            }
            
            var emptyPlayer = false;
            for (var i in results[0]){
                if(results[0][i] == null){
                    var cbSql = new Mysql();
                    var data= {};
                    data[i] = PlayerIdGenerate();
                    playerId = data[i];
                    cbSql.Update("game", data, "game_id="+gameId,function(err, data, fields){
                        if (err) throw err;
                        return callback(err, playerId);
                    });
                    emptyPlayer = true;
                    break;
                }
            }
            if(!emptyPlayer){
                return callback("No space for another player","");
            }
        });       
        
    }

    that.GetId = function(){
        return gameId;
    }

    that.CreateRoom = function(callback){
        InsertGameInfo(gameId, function(err, gameId, playerId){
            if(err) throw err;
            return callback(err, gameId, playerId);       
        });
    }

    that.JoinRoom = function(gameId, callback){
        InsertPlayerInfo(gameId, function(err, playerId){
            if(err) console.log( err);
            return callback(err, playerId);
        });
    }

    return that;
};

module.exports = Room;
var room = new Room();
/*room.CreateRoom(function(err, gameId, playerId){
    console.log(gameId+"  "+playerId);
});*/
/*room.JoinRoom(2016280273479, function(err, playerId){
    if(err){
        console.log(err);
    }else{
        console.log(playerId);
    }
});*/