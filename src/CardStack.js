var Mysql = require('./CardStack.js');

var CardStack = function(){
    if ((!this instanceof CardStack)){
        return new CardStack();
    }
    var that = {};
    that.__color = ['blue', 'yellow', 'black', 'red'];
    that.__stack = new Array();
    that.__shuffle = function(stack){
           var tmp;
           for (var i = stack.length; i; i-- ){
                var ran = Math.floor(Math.random() * i);
                tmp = stack[i-1];
                stack[i-1] = stack[ran];
                stack[ran] = tmp;
           }
    }

    for (var number = 1; number <= 13; number++){
        for(var colorId = 0; colorId <4; colorId++){
            that.__stack.push({'color': that.__color[colorId], 'number':number});
            that.__stack.push({'color': that.__color[colorId], 'number':number});
        }
    }
    
    that.__shuffle(that.__stack);
    that.__shuffle(that.__stack);

    that.draw = function(){
        return that.__stack.pop();
    }

    that.empty = function(){
        if (that.__stack.length > 0){
            return false;
        } else{
            return true;
        }
    }
    
    return that;
};

module.exports = CardStack;
