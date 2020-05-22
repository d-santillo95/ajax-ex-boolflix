$(document).ready(function() {
    $('#search-input').keyup(function(){
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
                    $('#search-page').html('');
                    for (var i = 0; i < data.results.length; i++) {
                        if (i%6==0) {
                            $('#search-page').append('<div class="row clearfix"></div>');
                        }
                        var box = {
                            img: data.results[i].poster_path,
                            title: data.results[i].title,
                            original_title: data.results[i].original_title,
                            language: data.results[i].original_language,
                            vote: data.results[i].vote_average
                        }
                        var html = template(box);
                        $('#search-page .row:last-of-type').append(html);
                    }
                },
                error: function(){
                    alert('si è verificato un errore');
                }
            })
        }
    })
})
