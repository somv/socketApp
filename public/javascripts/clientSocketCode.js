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
        html += '</div>';

        html+= '</div>';
        html+= '</div>';
        html+= '</div>';
        return html;
    };

    createNew.click(function () {
       var roomNo = Math.ceil(Math.random()*100000000);
       var html = createNewGame(roomNo, 6, 6);
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
            socket.emit('score calculate', options);
            socket.emit('cell clicked', options);
        } else {
            return;
        }
    });

    // Change color
    socket.on('change color', function (options) {
        var roomId = '#'+options.roomId;
        $(roomId).find(options.cellId).css("background-color", options.color);
    });

    var enableButton = function(element) {
        $(element).removeAttr("disabled");
    }

    // Block game
    socket.on('block game', function (options) {
        var roomId = '#'+options.roomId;
        var element = $(roomId).find('.btn-floating');
        element.attr("disabled", true);
        setTimeout(function() { enableButton(element) }, 2000);
    });

    // Update score
    socket.on('update score', function (options) {
        var roomId = '#'+options.roomId;
        var previousScore = $(roomId).find('#playerScore').html();
        var latestScore;
        if(previousScore == "0") latestScore = 0;
        else latestScore = parseInt(previousScore);
        console.log("latest score "+latestScore);
        var appendScore = latestScore+1;
        if($(roomId).find('#playerScore').html() == "0") {
            $(roomId).find('#playerScore').html("");
            $(roomId).find('#playerScore').append(latestScore);
            return;
        }
        else {
            $(roomId).find('#playerScore').html("");
            $(roomId).find('#playerScore').append(latestScore);
        }
    });

});