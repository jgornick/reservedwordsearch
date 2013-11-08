(function() {
    var
        words;

    /**
     * Shows a message in the status message container.
     *
     * @param  {String} message
     */
    function showMessage(message) {
        $('.search-message').html(message);
    }

    /**
     * Returns a list of filtered words.
     *
     * @param  {String} filter
     *
     * @return {Array}
     */
    function filterWords(filter) {
        if ($.trim(filter) == '') {
            return [];
        }

        var
            re = new RegExp(filter, 'i'),
            filteredWords;

        filteredWords = $.map(words, function(value, key) {
            return re.test(key) ? { word: key, platforms: value } : null;
        });

        return filteredWords;
    }

    /**
     * Shows the results for the specified value.
     *
     * @param  {String} value
     */
    function showWords(value) {
        value = $.trim(value);

        switch (value.length) {
            case 0:
                return showMessage('To begin, start typing in the box above.');
            case 1:
            case 2:
                return showMessage('You\'re almost there, two or more characters are required.');
        }

        var
            html = [],
            filteredWords = filterWords(value),
            wordItem,
            versionIndex;

        if (!filteredWords.length) {
            return showMessage('No words found.');
        }

        for (var i = 0, len = filteredWords.length; i < len; i++) {
            wordItem = filteredWords[i];
            word = wordItem.word;

            html.push('<tbody>');
            html.push('<tr><td colspan="3" class="active"><strong>' + word + '</strong></td></tr>');

            $.each(wordItem.platforms, function(platform, versions) {
                versionIndex = 0;
                $.each(versions, function(version, tags) {
                    html.push('<tr>');

                    if (versionIndex++ === 0) {
                        html.push('<td rowspan="' + Object.keys(versions).length + '">' + platform + '</td>');
                    }

                    html.push('<td>' + version + '</td>');
                    html.push('<td>' + tags.join(', ') + '</td>');
                    html.push('</tr>');
                });
            });

            html.push('</tbody>');
        }

        showMessage(filteredWords.length + ' words found.');
        $('.words-table').html(html.join(''));
    }

    /**
     * Handler for the search input keyup.
     *
     * @param  {Event} e
     */
    function onSearchInputKeyup(e) {
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
            return true;
        }

        showWords($(e.target).val());
    }

    $(document).ready(function() {
        $.getJSON('/rws/words.json', function(data) {
            words = data;

            var
                query = window.location.search.substr(1).split('='),
                queryWordIndex = $.inArray('word', query);

            if (queryWordIndex > -1) {
                $('.search-input').val(query[queryWordIndex + 1]);
            }

            showWords(
                $('.search-input')
                    .on('keyup', onSearchInputKeyup)
                    .focus()
                    .val()
            );
        });
    });
}());