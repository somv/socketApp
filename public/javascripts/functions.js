/**
 * Created by somveer on 21/1/17.
 */
$(document).ready(function() {

    function createNewGame(roomId, m, n) {

        var html = '<div class="row center">';
        html += '<div class="col s12 m4 l4 offset-l4 offset-m4">';
        html += '<div class="card grey lighten-4" id="'+roomId+'">';
        html += '<div class="card-content black-text">';
        for(var i=1;i<=m;i++){
            html += '<div class="row">';
            for(var j=1;j<=n;j++){
                html += '<span class="board-cell">';
                var cellId = ''+i+''+j;
                html += '<button id="'+cellId+'" class="btn">';
                html += '</button></span>';
            }
            html += '</div>';
        }
        html+= '</div>';
        html+= '</div>';
        html+= '</div>';
        html+= '</div>';

        return html;
    }

    console.log(createNewGame(1, 3, 3));
    $('#home-page-body').append(createNewGame(1, 3, 3));

});
