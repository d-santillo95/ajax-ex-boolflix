$(document).ready(function() {
    var template_box = Handlebars.compile($('#box-template').html());
    var template_principal_box = Handlebars.compile($('#principal-box-template').html());
    var url_tmdb = 'https://api.themoviedb.org/3/';
    var key_tmdb = 'ab01f80fcd1c767af6b3f7ec4f2fc2a0';

    $('.btn-home').click(function() {
        $('#search-page').html('');
        $('#wrap-search-page').removeClass('active');
        $('#home-page').addClass('active');
        $('.btn-home').addClass('active');
    })

    $('#search-input').keyup(function(e) {
        if(e.which == 13) {
            if ($(this).val().trim() == '') {
                $('#search-page').html('');
                $('#wrap-search-page').removeClass('active');
                $('#home-page').addClass('active');
                $('.btn-home').addClass('active');
            } else {
                var r = $(this).val();
                $('#search-page').html('');
                $('#search-paramater').text(r);
                call_ajax(url_tmdb, key_tmdb, template_box, r, 'search/movie', 0);
                call_ajax(url_tmdb, key_tmdb, template_box, r, 'search/tv', 1);
                $('#wrap-search-page').addClass('active');
                $('#home-page').removeClass('active');
                $('.btn-home').removeClass('active');
                $(this).val('');
            }
        }
    })

    $(window).on("scroll", function() {
        if($(window).scrollTop() > 60) {
            $("header").addClass("scrolled");
        } else {
           $("header").removeClass("scrolled");
        }
    });
})

function call_ajax(url, key, template, r, search, type, page = 1) {
    $.ajax({
        url: url + search,
        data: {
            api_key: key,
            language: 'it',
            query: r,
            page: page
        },
        success: function(data) {
            create_box(data.results, template, type);
            if (data.total_pages > page  && page < 6) {
                page +=1;
                call_ajax(url, key, template, r, search, type, page);
            }
        },
        error: function() {
            alert('si è verificato un errore');
        }
    })
}

function create_box(data, template, type) {
    for (var i = 0; i < data.length; i++) {
        if ($('.row:last-of-type .box-film').length % 6 == 0) {
            $('#search-page').append('<div class="row clearfix"></div>');
        }
        if (type == 0) {
            var box = create_object_film(data[i]);
        } else if (type == 1) {
            var box = create_object_tvshow(data[i]);
        }
        if (!box.img) {
            box.img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTU9fO4qpCMJjSKHoppgr2WecWZ9oO8NfTBr3VR1DtpYZFdbZa2&usqp=CAU'
        } else {
            box.img = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + box.img;
        }
        var html = template(box);
        $('#search-page .row:last-of-type').append(html);
    }
}

function create_object_film(data) {
    var box = {
        img: data.poster_path,
        title: data.title,
        original_title: data.original_title,
        language: create_flag(data.original_language),
        vote: create_star(round_number(data.vote_average / 2)),
        overview: data.overview
    }
    return (box);
}

function create_object_tvshow(data) {
    var box = {
        img: data.poster_path,
        title: data.name,
        original_title: data.original_name,
        language: create_flag(data.original_language),
        vote: create_star(round_number(data.vote_average / 2)),
        overview: data.overview
    }
    return (box);
}

function create_flag(l) {
    var ls = ['en', 'it'];
    if (ls.includes(l)) {
        return ('<img src="icons/' + l + '.png" alt="' + l + '">');
    } else {
        return (l);
    }
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
