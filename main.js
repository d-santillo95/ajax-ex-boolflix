$(document).ready(function() {
    var template_box = Handlebars.compile($('#box-template').html());
    var template_principal_box = Handlebars.compile($('#principal-box-template').html());
    var url_tmdb = 'https://api.themoviedb.org/3/';
    var key_tmdb = 'ab01f80fcd1c767af6b3f7ec4f2fc2a0';
    var genres_tmdb = [];
    $.ajax({
        url: url_tmdb + 'genre/movie/list',
        data: {
            api_key: key_tmdb
        },
        success: function(database) {
            var s = '';
            var j = 0;
            var k = 0;
            while (j < database.genres.length) {
                if (!genres_tmdb.includes(database.genres[j].id)) {
                    genres_tmdb.push(database.genres[j].id);
                    $('#search-genres').append('<option value="' + database.genres[j].id + '">' + database.genres[j].name + '</option>');
                }
                j += 1;
            }
        },
        error: function() {
            alert('si è verificato un errore');
        }
    })

    $.ajax({
        url: url_tmdb + 'genre/tv/list',
        data: {
            api_key: key_tmdb
        },
        success: function(database) {
            var j = 0;
            while (j < database.genres.length) {
                if (!genres_tmdb.includes(database.genres[j].id)) {
                    genres_tmdb.push(database.genres[j].id);
                    $('#search-genres').append('<option value="' + database.genres[j].id + '">' + database.genres[j].name + '</option>');
                }
                j += 1;
            }
        },
        error: function() {
            alert('si è verificato un errore');
        }
    })

    $.ajax({
        url: url_tmdb + 'trending/tv/week',
        data: {
            api_key: key_tmdb,
            language: 'it',
        },
        success: function(data) {
            var n = Math.floor(Math.random() * 7);
            for (var i = 0; i < data.results.length && i <= 6; i++) {
                var box = create_object_tvshow(data.results[i]);
                if (i == n) {
                    if (!data.results[i].backdrop_path) {
                        box.img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTU9fO4qpCMJjSKHoppgr2WecWZ9oO8NfTBr3VR1DtpYZFdbZa2&usqp=CAU'
                    } else {
                        box.img = 'https://image.tmdb.org/t/p/original/' + data.results[i].backdrop_path;
                    }
                    var html = template_principal_box(box);
                    $('#home-page').prepend(html);
                } else {
                    if (!box.img) {
                        box.img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTU9fO4qpCMJjSKHoppgr2WecWZ9oO8NfTBr3VR1DtpYZFdbZa2&usqp=CAU'
                    } else {
                        box.img = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + box.img;
                    }
                    var html = template_box(box);
                    $('#other-boxes .row:nth-child(2)').append(html);
                }
            }
            $('.box-film').each(function() {
                var data_id = $(this).attr('data-id');
                var data_genre = $(this).attr('data-genre');
                if (data_id.charAt(0) == 't') {
                    $.ajax({
                        url: url_tmdb + 'tv/' + data_id.slice(1) + '/credits',
                        data: {
                            api_key: key_tmdb
                        },
                        success: function(database) {
                            var s = '';
                            for (var j = 0; j < database.cast.length && j < 5; j++) {
                                if (j == database.cast.length - 1 || j == 4) {
                                    s += database.cast[j].name;
                                } else {
                                    s += (database.cast[j].name + ', ');
                                }
                            }
                            $('[data-id=' + data_id + ']').find('.cast').html('<p>Cast: ' + s + '</p>');
                        },
                        error: function() {
                            alert('si è verificato un errore');
                        }
                    })
                    $.ajax({
                        url: url_tmdb + 'genre/movie/list',
                        data: {
                            api_key: key_tmdb
                        },
                        success: function(database) {
                            var s = '';
                            var j = 0;
                            var k = 0;
                            while (j < database.genres.length && k < 3) {
                                if (data_genre.includes(database.genres[j].id)) {
                                    s += (database.genres[j].name + ' - ');
                                    k += 1;
                                }
                                j += 1;
                            }
                            s = s.slice(0, -3);
                            $('[data-id=' + data_id + ']').find('.genres').html('<p>' + s + '</p>');
                        },
                        error: function() {
                            alert('si è verificato un errore');
                        }
                    })
                }
            });
        },
        error: function() {
            alert('si è verificato un errore');
        }
    })

    $.ajax({
        url: url_tmdb + 'trending/movie/week',
        data: {
            api_key: key_tmdb,
            language: 'it',
        },
        success: function(data) {
            for (var i = 0; i < data.results.length && i < 6; i++) {
                var box = create_object_film(data.results[i]);
                if (!box.img) {
                    box.img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTU9fO4qpCMJjSKHoppgr2WecWZ9oO8NfTBr3VR1DtpYZFdbZa2&usqp=CAU'
                } else {
                    box.img = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + box.img;
                }
                var html = template_box(box);
                $('#other-boxes .row:last-of-type').append(html);
            }
            $('.box-film').each(function() {
                var data_id = $(this).attr('data-id');
                var data_genre = $(this).attr('data-genre');
                if (data_id.charAt(0) == 'm') {
                    $.ajax({
                        url: url_tmdb + 'movie/' + data_id.slice(1) + '/credits',
                        data: {
                            api_key: key_tmdb
                        },
                        success: function(database) {
                            var s = '';
                            for (var j = 0; j < database.cast.length && j < 5; j++) {
                                if (j == database.cast.length - 1 || j == 4) {
                                    s += database.cast[j].name;
                                } else {
                                    s += (database.cast[j].name + ', ');
                                }
                            }
                            $('[data-id=' + data_id + ']').find('.cast').html('<p>Cast: ' + s + '</p>');
                        },
                        error: function() {
                            alert('si è verificato un errore');
                        }
                    })
                    $.ajax({
                        url: url_tmdb + 'genre/tv/list',
                        data: {
                            api_key: key_tmdb
                        },
                        success: function(database) {
                            var s = '';
                            var j = 0;
                            var k = 0;
                            while (j < database.genres.length && k < 3) {
                                if (data_genre.includes(database.genres[j].id)) {
                                    s += (database.genres[j].name + ' - ');
                                    k += 1;
                                }
                                j += 1;
                            }
                            s = s.slice(0, -3);
                            $('[data-id=' + data_id + ']').find('.genres').html('<p>' + s + '</p>');
                        },
                        error: function() {
                            alert('si è verificato un errore');
                        }
                    })
                }
            });
        },
        error: function() {
            alert('si è verificato un errore');
        }
    })

    $('.btn-home').click(function() {
        $('#search-page').html('');
        $('#wrap-search-page').removeClass('active');
        $('#home-page').addClass('active');
        $('.btn-home').addClass('active');
    })

    $('#search-input').keyup(function(e) {
        if (e.which == 13) {
            var r = $(this).val().trim();
            if (r == '') {
                $('#search-genres').val(-1);
                $('#search-page').html('');
                $('#wrap-search-page').removeClass('active');
                $('#home-page').addClass('active');
                $('.btn-home').addClass('active');
            } else {
                $('#search-page').html('');
                $('#search-paramater').text(r);
                call_ajax(url_tmdb, key_tmdb, template_box, r, 'search/movie', 0);
                call_ajax(url_tmdb, key_tmdb, template_box, r, 'search/tv', 1);
                $('#wrap-search-page').addClass('active');
                $('#home-page').removeClass('active');
                $('.btn-home').removeClass('active');
                $(this).val('');
                $('#search-genres').val(-1);
            }
        }
    })

    $('#search-genres').change(function() {
        var genre = $('#search-genres').val();
        $('#search-page .box-film').removeClass('unselected');
        $('#search-page .box-film').each(function() {
            var data_genre = $(this).attr('data-genre');
            if (!data_genre.includes(genre)) {
                $(this).addClass('unselected');
            }
        })
    })

    $(window).on("scroll", function() {
        if ($(window).scrollTop() > 60) {
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
            if (data.total_pages > page && page < 6) {
                page += 1;
                call_ajax(url, key, template, r, search, type, page);
            } else {
                $('.box-film').each(function() {
                    var data_id = $(this).attr('data-id');
                    var data_genre = $(this).attr('data-genre');
                    if (data_id.charAt(0) == 'm') {
                        $.ajax({
                            url: url + 'movie/' + data_id.slice(1) + '/credits',
                            data: {
                                api_key: key
                            },
                            success: function(database) {
                                var s = '';
                                for (var j = 0; j < database.cast.length && j < 5; j++) {
                                    if (j == database.cast.length - 1 || j == 4) {
                                        s += database.cast[j].name;
                                    } else {
                                        s += (database.cast[j].name + ', ');
                                    }
                                }
                                $('[data-id=' + data_id + ']').find('.cast').html('<p>Cast: ' + s + '</p>');
                            },
                            error: function() {
                                alert('si è verificato un errore');
                            }
                        })
                        $.ajax({
                            url: url + 'genre/movie/list',
                            data: {
                                api_key: key
                            },
                            success: function(database) {
                                var s = '';
                                var j = 0;
                                var k = 0;
                                while (j < database.genres.length && k < 3) {
                                    if (data_genre.includes(database.genres[j].id)) {
                                        s += (database.genres[j].name + ' - ');
                                        k += 1;
                                    }
                                    j += 1;
                                }
                                s = s.slice(0, -3);
                                $('[data-id=' + data_id + ']').find('.genres').html('<p>' + s + '</p>');
                            },
                            error: function() {
                                alert('si è verificato un errore');
                            }
                        })
                    } else if (data_id.charAt(0) == 't') {
                        $.ajax({
                            url: url + 'tv/' + data_id.slice(1) + '/credits',
                            data: {
                                api_key: key
                            },
                            success: function(database) {
                                var s = '';
                                for (var j = 0; j < database.cast.length && j < 5; j++) {
                                    if (j == database.cast.length - 1 || j == 4) {
                                        s += database.cast[j].name;
                                    } else {
                                        s += (database.cast[j].name + ', ');
                                    }
                                }
                                $('[data-id=' + data_id + ']').find('.cast').html('<p>Cast: ' + s + '</p>');
                            },
                            error: function() {
                                alert('si è verificato un errore');
                            }
                        })
                        $.ajax({
                            url: url + 'genre/tv/list',
                            data: {
                                api_key: key
                            },
                            success: function(database) {
                                var s = '';
                                var j = 0;
                                var k = 0;
                                while (j < database.genres.length && k < 3) {
                                    if (data_genre.includes(database.genres[j].id)) {
                                        s += (database.genres[j].name + ' - ');
                                        k += 1;
                                    }
                                    j += 1;
                                }
                                s = s.slice(0, -3);
                                $('[data-id=' + data_id + ']').find('.genres').html('<p>' + s + '</p>');
                            },
                            error: function() {
                                alert('si è verificato un errore');
                            }
                        })
                    }
                });
            }
        },
        error: function() {
            alert('si è verificato un errore');
        }
    })
}

function create_box(data, template, type) {
    for (var i = 0; i < data.length; i++) {
        // if ($('#search-page .row:last-of-type .box-film').length % 6 == 0) {
        //     $('#search-page').append('<div class="row clearfix"></div>');
        // }
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
        $('#search-page').append(html);
    }
}

function create_object_film(data) {
    var box = {
        img: data.poster_path,
        title: data.title,
        original_title: data.original_title,
        language: create_flag(data.original_language),
        vote: create_star(round_number(data.vote_average / 2)),
        overview: data.overview,
        id: 'm' + data.id,
        genre: data.genre_ids.join(' ')
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
        overview: data.overview,
        id: 't' + data.id,
        genre: data.genre_ids.join(' ')
    }
    return (box);
}

function create_flag(l) {
    var ls = ['en', 'it', 'es', 'ja', 'fr'];
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
