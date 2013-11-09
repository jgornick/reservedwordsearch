(function() {
    var
        words,
        sifter;

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
            filteredWords = [],
            searchResult;

        searchResult = sifter.search(filter, {
            fields: ['word'],
            sort: [{field: 'word', direction: 'asc' }]
        });

        for (var i = 0, len = searchResult.items.length; i < len; i++) {
            filteredWords.push(words[searchResult.items[i].id]);
        }

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
                $('.words-table').empty();
                return showMessage('To begin, start typing in the box above.');
            case 1:
            case 2:
                $('.words-table').empty();
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
            // Convert the words.json into a format that we can use with the
            // sifter library for better searching.
            words = $.map(data, function(value, key) {
                return { word: key, platforms: value };
            });

            sifter = new Sifter(words);

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