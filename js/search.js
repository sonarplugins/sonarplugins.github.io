(function() {
  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';
    
        appendString += '<div class="text-center">Plugins <span class="badge">'+results.length+'</span></div>'
      appendString += '<div style="padding-top: 50px">'
      appendString += '<div class="row">'
      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
          
          appendString += '<div class="col-sm-4 portfolio-item">'
          appendString += '<a href="' + item.url + '" class="portfolio-link" data-toggle="modal">'
          appendString += '<div class="caption"><div class="caption-content"><i class="fa fa-search-plus fa-3x"></i></div></div>'
          appendString += '<div>'
          appendString += '<h3>' + item.title + '</h3>'
          appendString += '<p>' + item.description + '</p>'
          appendString += '<h5 class="label label-success">' + item.category + '</h5>&nbsp&nbsp'
          if(item.license == 'Commercial') {
              appendString += '<h5 class="label label-danger">' + item.license + '</h5>'
          }
          appendString += '</div>'
          appendString += '</a>'
          appendString += '</div>'
      }
        appendString += '</div>'
        appendString += '</div>'

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<h2 class="text-center">No results</h2>';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('category');
      this.field('license');
      this.field('content');
    });

    for (var key in window.store) { // Add the data to lunr
      idx.add({
        'id': key,
        'title': window.store[key].title,
        'author': window.store[key].author,
        'category': window.store[key].category,
        'license': window.store[key].license,
        'content': window.store[key].content
      });

      var results = idx.search(searchTerm); // Get lunr to perform a search
      displaySearchResults(results, window.store); // We'll write this in the next section
    }
  }
})();
