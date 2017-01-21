/**
 * Created by somveer on 15/1/17.
 */

var options = {
    userName : "somveer",
    color : "red"
};

var User = function User(options) {
    this.userName = options.userName;
    this.color = options.color;
};

User.prototype.getDetail = function () {
    console.log("name: "+this.userName+" age: "+this.color);
};

module.exports = User;