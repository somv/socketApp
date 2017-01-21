/**
 * Created by somveer on 15/1/17.
 */

var options = {
    length : 3,
    breadth : 3,
    players : [],
};

var Board = function Board(name, age) {
    this.name = name;
    this.age = age;
};

Board.prototype.getDetail = function () {
    console.log("name: "+this.name+" age: "+this.age);
};

module.exports = Board;