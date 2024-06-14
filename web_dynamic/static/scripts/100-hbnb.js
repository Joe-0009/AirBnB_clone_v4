$(document).ready(function() {
    const selectedAmenities = {};
    const selectedStates = {};
    const selectedCities = {};
  
    // Listen to changes on input checkboxes for amenities
    $('input:checkbox').change(function() {
      if ($(this).is(':checked')) {
        if ($(this).parent().parent().parent().hasClass('locations')) {
          if ($(this).parent().parent().prev().text() === 'States') {
            selectedStates[$(this).data('id')] = $(this).data('name');
          } else {
            selectedCities[$(this).data('id')] = $(this).data('name');
          }
        } else {
          selectedAmenities[$(this).data('id')] = $(this).data('name');
        }
      } else {
        if ($(this).parent().parent().parent().hasClass('locations')) {
          if ($(this).parent().parent().prev().text() === 'States') {
            delete selectedStates[$(this).data('id')];
          } else {
            delete selectedCities[$(this).data('id')];
          }
        } else {
          delete selectedAmenities[$(this).data('id')];
        }
      }
  
      const selected = Object.values(selectedAmenities).concat(Object.values(selectedStates)).concat(Object.values(selectedCities));
      if (selected.length === 0) {
        $('div.locations > h4').html('&nbsp;');
      } else {
        $('div.locations > h4').text(selected.join(', '));
      }
    });
  
    // Request API status and update the div#api_status
    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  
    // When the search button is clicked, make a POST request to places_search
    $('button').click(function() {
      const data = {
        amenities: Object.keys(selectedAmenities),
        states: Object.keys(selectedStates),
        cities: Object.keys(selectedCities)
      };
  
      $.ajax({
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          $('section.places').empty();
          for (const place of response) {
            $('section.places').append(
              `<article>
                <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                  <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                  <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div class="description">
                  ${place.description}
                </div>
              </article>`
            );
          }
        }
      });
    });
  });
  