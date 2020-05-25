$(document).ready(function() {
    $('#search-input').keyup(function() {
        if ($(this).val() == '') {
            $('#search-page').html('');
        } else {
            var r = $(this).val();
            var template = Handlebars.compile($('#box-template').html());
            $.ajax({
                url: 'https://api.themoviedb.org/3/search/movie',
                data: {
                    api_key: 'ab01f80fcd1c767af6b3f7ec4f2fc2a0',
                    language: 'it',
                    query: r
                },
                success: function(data) {
                    create_box(data, template);
                },
                error: function() {
                    alert('si è verificato un errore');
                }
            })
        }
    })
})

function create_box(data, template) {
    $('#search-page').html('');
    for (var i = 0; i < data.results.length; i++) {
        if (i % 6 == 0) {
            $('#search-page').append('<div class="row clearfix"></div>');
        }
        var box = {
            img: data.results[i].poster_path,
            title: data.results[i].title,
            original_title: data.results[i].original_title,
            language: data.results[i].original_language,
            vote: create_star(round_number(data.results[i].vote_average / 2))
        }
        var html = template(box);
        $('#search-page .row:last-of-type').append(html);
    }
}

function round_number(n) {
    var m = Math.trunc(n);
    var q = n - m;
    if (q >= 0.25 && q <= 0.75) {
        return (m + 0.5);
    } else {
        return (parseInt(Math.round(n)));
    }
}

function create_star(n) {
    var s = '';
    var i = 0;
    while (i < Math.trunc(n)) {
        s = s + '<i class="fas fa-star"></i> ';
        i++;
    }
    if (!Number.isInteger(n)) {
        s = s + '<i class="fas fa-star-half-alt"></i> ';
        i++;
    }
    while (i < 5) {
        s = s + '<i class="far fa-star"></i> ';
        i++;
    }
    return (s);
}
