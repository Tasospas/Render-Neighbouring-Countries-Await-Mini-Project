'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// Συνάρτηση υπε΄΄υθυνη στο να κάνει render τις χώρες που επιλέγουμε

const renderCountry = function (data) {
  const html = `<article class="country">
  <img class="country__img" src="${data.flag}" />
  <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)}</p>
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
  </div>
</article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);

  // countriesContainer.style.opacity = 1;
};

// Συνάρτηση υπευθυνη για τα σφάλματα, απεικόνιση του σφάλματος στο χρήστη

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
  // countriesContainer.style.opacity = 1;
};

// Συνάρτηση υπεύθυνη στο να συνδεθούμε με το API και να πάρουμε τα δεδομένα για τις χώρες

const getCountryAndNeighbor = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(function (response) {
      //console.log(response);
      // Ελέγχουμε αν υπάρχει η χώρα
      if (!response.ok) {
        throw new Error(` Country not found (${response.status})`);
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      //const neighbour = 'notacountry';
      //console.log(neighbour);
      // if (!neighbour) return;

      if (!neighbour) throw new Error(`This country has no neighbours`);

      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error(` Neighbour not found (${response.status})`);
      }
      return response.json();
    })
    .then(function (data) {
      renderCountry(data);
    })
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong: ${err.message}. Please try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryAndNeighbor('Greece');
});

// Τσεκάρουμε αν υπάρχει η χώρα, αν οχι, εμφανίζουμε error 404

//getCountryAndNeighbor('thiscountrydoesnotexist');
