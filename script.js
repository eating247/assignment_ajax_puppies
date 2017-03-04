// var APP = APP || {};

Controller = (function() {

  init = function() {
    getBreeds();
    refreshListener();
    submitListener();
    adoptListener();
  }

  adoptListener = function() {
    $('ul').on('click', '.adopt', function(e) {
      e.preventDefault();
      adoptPuppy(e);
    } );
  }

  adoptPuppy = function(e) {
    var puppy_id = $(e.target).attr('puppy_id');
    $.ajax({
      url: 'https://ajax-puppies.herokuapp.com/puppies/' + puppy_id + '.json',
      method: "DELETE",
      contentType: 'application/json',
      dataType: 'json',
      success: function(data, status, xhr) { removePuppies(data) },
      error: function(xhr, status, error) { displayError(error) },
      complete: function(xhr, status) { console.log('adopt complete') },
    });
  }

  removePuppies = function(data) {
    // console.log(data.id)
    $('li').remove();
    refreshPuppies();
  }

  getBreeds = function() {
    $.ajax({
      url: "https://ajax-puppies.herokuapp.com/breeds.json",
      method: 'GET',
      dataType: 'json',
      success: function(breeds) { showBreeds(breeds) },
      error: function() {console.log('breed dropdown error')},
      complete: function() {console.log('breed list complete')}
    });
  }

  showBreeds = function(breeds) {
    breeds.forEach( function(breed) {
      $breed = $('<option></option>').attr("value", breed.id).html(breed.name);
      $('select').append($breed);
    });
  }

  submitListener = function() {
    $('form').submit(function(e) {
      e.preventDefault();
      registerPuppy(e);
    })
  }

  registerPuppy = function(e) {
    var data = $(e.target).serializeArray();
    data = { name: data[0].value, breed_id: data[1].value };
    data = JSON.stringify(data);
    $.ajax({
      method: 'post',
      url: 'https://ajax-puppies.herokuapp.com/puppies.json',
      data: data,
      dataType: 'json',
      contentType: "application/json",
      success: function(pup) { displayNewPuppy(pup) },
      complete: function() { console.log('complete') },
      error: function(xhr, status, error) { displayError(error) },
    });
  }

  displayNewPuppy = function(pup) {
    $adopt = $('<a></a>').text('Adopt').addClass('adopt');
    $pup = $('<li></li>').text(pup.name + ' (' + pup.breed_id + '), created at ' + pup.created_at + ' --- ');
    $pup.append($adopt);
    $('ul').prepend($pup);
  }

  displayError = function(error) {
    $error = $('<h4></h4>').html('Error: ' + error);
    $('form').after($error);
  }

  refreshListener = function() {
    $('#refresh').click( function(e) { 
      e.preventDefault();
      refreshPuppies();
    } );
  }

  refreshPuppies = function() {
    $.ajax( {
      method: 'GET',
      url: 'https://ajax-puppies.herokuapp.com/puppies.json',
      success: function(puppies) { displayPuppies(puppies) },
      error: function() { console.log('error') },
      complete: function() { console.log('puppy list complete') },
      async: true
  });
  }

  displayPuppies = function(puppies) {
    puppies.forEach(function(pup){
      $adopt = $('<a></a>').text('Adopt').addClass('adopt').attr("puppy_id", pup.id);
      $pup = $('<li></li>').html(pup.name + ' (' + pup.breed.name + '), created at ' + pup.created_at + ' --- ');
      $pup.append($adopt);
      $('ul').append($pup);
    });
  }

  return {
    init: init
  }

})();


$( document ).ready(function() { Controller.init() } );