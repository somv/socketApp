/**
 * Created by somveer on 21/1/17.
 */
$(document).ready(function() {
    var socket = io.connect('http://localhost:3000');
    var userForm = $('#userForm');
    var userName = $('#userName');
    var playerName = $('#player-name');
    var playerColor = $('#player-color');
    var playerScore = $('#player-score');
    var mainBody = $('#home-page-body');
    var createNew = $('#createButton');
    var blockingTime = 100;
    mainBody.css('display', 'none');
    var backgroundColor = "white";

    function createNewGame(roomId, m, n) {
        var html = '<div class="divider"></div>';
        html += '<div class="row center">';
        //html += '<div class="col s12 m4 l4 offset-l4 offset-m4">';
        html += '<div>';
        html += '<div class="card grey lighten-4" id="'+roomId+'">';
        html += '<div class="col m8 l8">'; // added later
        html += '<div class="card-content black-text">';
        for(var i=1;i<=m;i++){
            html += '<div class="row">';
            for(var j=1;j<=n;j++){
                html += '<span class="board-cell" style="margin: 10px;">';
                var cellId = ''+i+''+j;
                html += '<button id="'+cellId+'" class="btn-floating btn-large">';
                html += '</button></span>';
            }
            html += '</div>';
        }
        html+= '</div>';

        html+= '</div>';//added later
        html += '<div class="col m4 l4">'; // added later
        html += '<div class="row" id="score">Your Score ';
        html += '<span id="playerScore">0</span>';
        html += '</div>';
        html += '<div class="row" id="maxScore">Max Score ';
        html += '<span id="maxPlayerScore">0</span>';
        html += '</div>';
        html += '<div class="row" id="maxScore">';
        html += '<span id="youWin" style="display: none">You Win!</span>';
        html += '<span id="youLoose" style="display: none">You Loose!</span>';
        html += '</div>';
        html += '</div>';

        html+= '</div>';
        html+= '</div>';
        html+= '</div>';
        return html;
    };

    createNew.click(function () {
       var roomNo = Math.ceil(Math.random()*100000000);
       var html = createNewGame(roomNo, 3, 3);
       socket.emit('create new game', html);
    });

    socket.on('append game', function (html) {
        $('#home-page-body').append(html);
    });

    userForm.submit(function (e) {
        e.preventDefault();
        socket.emit('new player', userName.val());
        mainBody.css('display', 'block');
    });

    socket.on('add player', function (options) {
        playerName.append(options.userName);
        playerColor.css('background-color', options.color);
        backgroundColor = options.color;
        userName.val('');
    });

    // When player clicks a cell
    $('#home-page-body').on('click','.board-cell', function () {
        var roomId = $(this).closest('.card').attr('id');
        console.log("Cell was clicked from room number: "+ roomId);
        console.log($(this).find('.btn-floating').css("background-color"));
        if($(this).find('.btn-floating').css("background-color") == 'rgb(255, 255, 255)') {
            $(this).find('.btn-floating').css("background-color", backgroundColor);
            var cellId = "#" + $(this).children('.btn-floating').attr('id');
            var options = {
                color: backgroundColor,
                cellId: cellId,
                socketId: socket.id,
                roomId: roomId
            };
            socket.emit('join room', options);
            socket.emit('cell clicked', options);
            socket.emit('score calculate', options);
        } else {
            return;
        }
    });

    // Change color
    socket.on('change color', function (options) {
        var roomId = '#'+options.roomId;
        $(roomId).find(options.cellId).css("background-color", options.color);
        console.log("change color");
        console.log(options);
        var userColor = options.color.replace(/\s/g, '');
        console.log("userColor "+userColor);
        var count = 0;
        var colors=[];
        var uniqueColors = [];
        var frequency = [];
        for(var i=0;i<$(roomId).find('.btn-floating').length;i++) {
            console.log($(roomId).find('.btn-floating')[i].style.backgroundColor);
            var buttonColor = $(roomId).find('.btn-floating')[i].style.backgroundColor;
            if(buttonColor!= "") {
                colors.push(buttonColor);
                if(uniqueColors.indexOf(buttonColor)<0) uniqueColors.push(buttonColor);
            }
            buttonColor = buttonColor.replace(/\s/g, '');
            console.log(userColor);
            if( buttonColor == userColor) count++;
        };
        for(var i=0;i<uniqueColors.length;i++){
            var f = 0;
            frequency[i]=0;
            for(var j=0;j<colors.length;j++){
                if(uniqueColors[i]==colors[j]) frequency[i]++;
            }
        }
        console.log("total colors availabe are");
        console.log(colors);
        console.log("total unique colors availabe are");
        console.log(uniqueColors);
        console.log(frequency);
        var max = 0;
        var winner = 0;
        for(var i=0;i<frequency.length;i++){
            if(frequency[i]>max){
                max = frequency[i];
                winner = i;
            }
        }
        console.log("max score is "+max);
        console.log("count is now "+count);
        socket.emit('score calculate', options, count, max);
        socket.emit('max score calculate', options, max);
        if (colors.length == $(roomId).find('.btn-floating').length) {
            socket.emit('game over', options);
        }
    });

    // Enable game after block time event
    var enableButton = function(element) {
        $(element).removeAttr("disabled");
    }

    // Block game
    socket.on('block game', function (options) {
        var roomId = '#'+options.roomId;
        var element = $(roomId).find('.btn-floating');
        element.attr("disabled", true);
        setTimeout(function() { enableButton(element) }, blockingTime);
    });

    // Update score
    socket.on('update score', function (options, count, max) {
        var roomId = '#'+options.roomId;
        $(roomId).find('#playerScore').html("");
        $(roomId).find('#playerScore').append(count);
    });

    // Update max score
    socket.on('update max score', function (options, max) {
        var roomId = '#'+options.roomId;
        $(roomId).find('#maxPlayerScore').html("");
        $(roomId).find('#maxPlayerScore').append(max);
    });

    // Update winner
    socket.on('update winner', function (options) {
        var roomId = '#'+options.roomId;
        var maxScore = parseInt($(roomId).find('#maxPlayerScore').html());
        var myScore = parseInt($(roomId).find('#playerScore').html());
        if ( myScore >= maxScore ) $(roomId).find('#youWin').css("display", "block");
        if(myScore>0 && myScore<maxScore) $(roomId).find('#youLoose').css("display", "block");
    });

});