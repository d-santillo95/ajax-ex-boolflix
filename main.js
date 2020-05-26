$(document).ready(function() {
    var template_box = Handlebars.compile($('#box-template').html());

    $('#search-input').keyup(function() {
        if ($(this).val().trim() == '') {
            $('#search-page').html('');
        } else {
            var r = $(this).val();
            var j = 0;
            $('#search-page').html('');
            $.ajax({
                url: 'https://api.themoviedb.org/3/search/movie',
                data: {
                    api_key: 'ab01f80fcd1c767af6b3f7ec4f2fc2a0',
                    language: 'it',
                    query: r
                },
                success: function(data) {
                    create_box(data.results, j, template_box, 0);
                },
                error: function() {
                    alert('si è verificato un errore');
                }
            })
            $.ajax({
                url: 'https://api.themoviedb.org/3/search/tv',
                data: {
                    api_key: 'ab01f80fcd1c767af6b3f7ec4f2fc2a0',
                    language: 'it',
                    query: r
                },
                success: function(data) {
                    create_box(data.results, j, template_box, 1);

                },
                error: function() {
                    alert('si è verificato un errore');
                }
            })
        }
    })
})

function create_object_film(data) {
    var box = {
        img: data.poster_path,
        title: data.title,
        original_title: data.original_title,
        language: create_flag(data.original_language),
        vote: create_star(round_number(data.vote_average / 2))
    }
    return (box);
}

function create_object_tvshow(data) {
    var box = {
        img: data.poster_path,
        title: data.name,
        original_title: data.original_name,
        language: create_flag(data.original_language),
        vote: create_star(round_number(data.vote_average / 2))
    }
    return (box);
}

function round_number(n) {
    var m = Math.trunc(n);
    var q = n - m;
    if (q >= 0.25 && q < 0.75) {
        return (m + 0.5);
    } else {
        return (parseInt(Math.round(n)));
    }
}

function create_star(n) {
    var s = '';
    var i = 1;
    while (i <= n) {
        s = s + '<i class="fas fa-star"></i> ';
        i++;
    }
    if (!Number.isInteger(n)) {
        s = s + '<i class="fas fa-star-half-alt"></i> ';
        i++;
    }
    while (i <= 5) {
        s = s + '<i class="far fa-star"></i> ';
        i++;
    }
    return (s);
}

function create_flag(l) {
    var ls = ['en', 'it'];
    if (ls.includes(l)) {
        return ('<img src="icons/' + l + '.png" alt="' + l + '">');
    } else {
        return (l);
    }
}

function create_box(data, j, template, type) {
    for (var i = 0; i < data.length; i++) {
        if (j % 6 == 0) {
            $('#search-page').append('<div class="row clearfix"></div>');
        }
        if (type == 0) {
            var box = create_object_film(data[i]);
        } else if (type == 1) {
            var box = create_object_tvshow(data[i]);
        }
        var html = template(box);
        $('#search-page .row:last-of-type').append(html);
        j++;
    }
}
