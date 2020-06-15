//  Date formats as needed

const time = moment();
const currentDate = $("#currentDay");
 
function setDate() {
   currentDate.html(time.format("dddd, MMMM Do, YYYY"));
};
 
setDate();
 
// Five Day Forecast Dates
 
const forecastDayOne = time.add(1, "days").format("ddd <br> M/D");

const forecastDayTwo = time.add(1, "days").format("ddd <br> M/D");

const forecastDayThree = time.add(1, "days").format("ddd <br> M/D");

const forecastDayFour = time.add(1, "days").format("ddd <br> M/D");

const forecastDayFive = time.add(1, "days").format("ddd <br> M/D");

 

 
var cityInput = $("#city-text");
var cityForm = $("#city-form");
var cityList = $("#city-list");
 
 
var cities = [];
 
pageLoad();
 
function renderCities() {
  // Clear cityList element
  $("#city-list").empty();
  // Render a new li for each city
  for (var i = 0; i < cities.length; i++) {
    let city = cities[i];
    var li = $(`<li id="${city}">`);
    var span = $('<span>');
    span.text(city);
    var button = $('<button>');
    button.text('___  Remove');
    button.data('index', i);
    li.append(span, button);
    cityList.append(li);
  };
 };
 

 // Get stored cities from localStorage

function pageLoad() {
   
   // Parsing the JSON string to an object
   const storedCities = JSON.parse(localStorage.getItem("cities"));

    // If cities were retrieved from localStorage, update the cities
   if (storedCities !== null) {
     cities = storedCities;
   }

    // Render cities to the search history section
   renderCities();
 }
 
 // Stringify and set cities key in localStorage to cities array
 function storeCities() {
   cities.splice(4);
   localStorage.setItem("cities", JSON.stringify(cities));
 }
 
 
// When a element inside of the searched cityList is clicked, you can remove from history or search again...

cityList.on('click', 'button', function () {
  var button = $(this);
  var index = button.data('index');
  cities.splice(index, 1);
  storeCities();
  renderCities();
 
 cityList.on('click', 'span', function () {
  var span = $(this);
  let city = span.text();
  // queryApi(city); TBD
  storeCities();
  renderCities();
 })
 });
 
/* Search by city name (e.g. athens) or separate city from 2 character country code as in: athens, gr) */
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
/* I pass my API Key into the URLs for search and forecast */
const apiKey = "4d8fb5b93d4af21d66a2948710284366";
 
$("button").click(function() {
   $(".UVIndex").empty();
   $(".cities").empty();
   $(".forecast5").empty();
});
 
form.addEventListener("submit", e => {
 e.preventDefault();
 let inputVal = input.value.toLowerCase();
 var cityText = cityInput.val().trim();
 if (cityText === '') {
   return;
 }
 
 cities.push(cityText);
 cities.splice(4);
 cityInput.value = "";
 
  storeCities();
 renderCities();
 
 // check if there's already a city
 const listItems = cities;
 const listItemsArray = Array.from(cities);
 
 if (listItemsArray.length > 0) {
   const filteredArray = listItemsArray.filter(inputVal => {
     let content = "";
     if (inputVal.includes(",")) {
       //athens,grrrr is an invalid country code, so we keep only the first part of inputVal
       if (inputVal.split(",")[1].length > 2) {
         inputVal = inputVal.split(",")[0];
         content = $("#city-list")
           .textContent.toLowerCase();
       } else {
         content = $("#city-list").dataset.name.toLowerCase();
       }
     } else {
       content = $("#city-list").text;
     }
     return content == inputVal.toLowerCase();
   });
 
   if (filteredArray.length > 0) {
     msg.textContent = `You already know the weather for ${
       filteredArray[0].querySelector("#city-list").textContent
     } ...otherwise be more specific by providing the country code as well 😉`;
     form.reset();
     input.focus();
     return;
   }
 }
 
 // Begin fetching URL's and AJAX here

 const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&cnt=5&appid=${apiKey}&units=imperial`;
 
 const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${inputVal}&cnt=45&appid=${apiKey}&units=imperial`;
 
 
// Fetch API URL for city weather

 fetch(url)
   .then(response => response.json())
   .then(data => {
     const { main, name, sys, weather, wind } = data;
     const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
       weather[0]["icon"]
     }.svg`;
 
     const li = document.createElement("li");
     li.classList.add("city");
     const markup = `
     <h2 class="city-name" data-name="${name},${sys.country}">
         <span>${name}</span>
         <sup>${sys.country}</sup>
       </h2>
       <div class="city-temp">${Math.round(main.temp)}<sup>°F</sup></div>
       <div class="humidity">Humidity ${main.humidity} / Wind ${Math.round(wind.speed)}</div> 
       <figure>
         <img class="city-icon" src="${icon}" alt="${
       weather[0]["description"]
     }">
         <figcaption>${weather[0]["description"]}</figcaption>
       </figure>
     `;
     li.innerHTML = markup;
     list.appendChild(li);
    

     var uvIndexLat = data.coord.lat;
     var uvIndexLon = data.coord.lon;

     let uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + uvIndexLat + "&lon=" + uvIndexLon + "&APPID=4d8fb5b93d4af21d66a2948710284366";


     //This is the UV Index API call and add on to return based on lat lon data sets

     $.ajax({
       url: uvIndexURL,
       method: "GET"
     })
       .then(function(response){
         $(".UVIndex").empty();
         $(".UVIndex").append("<h2>UV Index is " + response.value + "</h2>");

         //This is the UV Index color code based on data response

         if (response.value < 3){
          $(".UVIndex").removeClass("uvViolet");
          $(".UVIndex").removeClass("uvRed");
          $(".UVIndex").removeClass("uvOrange");
          $(".UVIndex").removeClass("uvYellow");
          $(".UVIndex").addClass("uvGreen");
         }
         if (response.value < 6 && response.value >= 3){
          $(".UVIndex").removeClass("uvViolet");
          $(".UVIndex").removeClass("uvRed");
          $(".UVIndex").removeClass("uvOrange");
          $(".UVIndex").removeClass("uvGreen");
          $(".UVIndex").addClass("uvYellow");
         }
         if (response.value < 8 && response.value >= 6){
          $(".UVIndex").removeClass("uvViolet");
          $(".UVIndex").removeClass("uvRed");
          $(".UVIndex").removeClass("uvGreen");
          $(".UVIndex").removeClass("uvYellow");
          $(".UVIndex").addClass("uvOrange");
         }
         if (response.value < 11 && response.value >= 8){
          $(".UVIndex").removeClass("uvViolet");
          $(".UVIndex").removeClass("uvOrange");
          $(".UVIndex").removeClass("uvGreen");
          $(".UVIndex").removeClass("uvYellow");
          $(".UVIndex").addClass("uvRed");
         }
         if (response.value > 11){
          $(".UVIndex").removeClass("uvRed");
          $(".UVIndex").removeClass("uvOrange");
          $(".UVIndex").removeClass("uvGreen");
          $(".UVIndex").removeClass("uvYellow");
          $(".UVIndex").addClass("uvViolet");
         }
       });

   })

   // Ensures a valid search

   .catch(() => {
     msg.textContent = "Please search for a valid city 😩";
   });
 
 msg.textContent = "";
 form.reset();
 input.focus();
 

 // Fetch Forecast API URL for city 5 Day Forecast

 fetch(urlForecast)
   .then(response => response.json())
   .then(data => {
    
     const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
       data.list[8].weather[0]["icon"]
     }.svg`;
 
     const li = document.createElement("li");
     li.classList.add("city");
     const markup = `
       <h2 class="forecast" id="date">
         <span>${forecastDayOne}</span>
       </h2>
       <div class="city-temp">${Math.round(data.list[5].main.temp)}<sup>°F</sup></div>
       <div class="humidity">Humidity ${data.list[5].main.humidity}</div>
       <figure>
         <img class="city-icon" src="${icon}" alt="${
           data.list[5].weather[0]["description"]
     }">
         <figcaption>${data.list[5].weather[0]["description"]}</figcaption>
       </figure>
     `;
     li.innerHTML = markup;
     $(".forecast5").append(li);
 
     const li2 = document.createElement("li");
     li2.classList.add("city");
     const markup2 = `
       <h2 class="forecast" id="date">
         <span>${forecastDayTwo}</span>
       </h2>
       <div class="city-temp">${Math.round(data.list[13].main.temp)}<sup>°F</sup></div>
       <div class="humidity">Humidity ${data.list[13].main.humidity}</div>
       <figure>
         <img class="city-icon" src="${icon}" alt="${
           data.list[13].weather[0]["description"]
     }">
         <figcaption>${data.list[13].weather[0]["description"]}</figcaption>
       </figure>
     `;
     li2.innerHTML = markup2;
     $(".forecast5").append(li2);
 
     const li3 = document.createElement("li");
     li3.classList.add("city");
     const markup3 = `
       <h2 class="forecast" id="date">
         <span>${forecastDayThree}</span>
       </h2>
       <div class="city-temp">${Math.round(data.list[21].main.temp)}<sup>°F</sup></div>
       <div class="humidity">Humidity ${data.list[21].main.humidity}</div>
       <figure>
         <img class="city-icon" src="${icon}" alt="${
           data.list[21].weather[0]["description"]
     }">
         <figcaption>${data.list[21].weather[0]["description"]}</figcaption>
       </figure>
     `;
     li3.innerHTML = markup3;
     $(".forecast5").append(li3);
 
     const li4 = document.createElement("li");
     li4.classList.add("city");
     const markup4 = `
       <h2 class="forecast" id="date">
         <span>${forecastDayFour}</span>
       </h2>
       <div class="city-temp">${Math.round(data.list[29].main.temp)}<sup>°F</sup></div>
       <div class="humidity">Humidity ${data.list[29].main.humidity}</div>
       <figure>
         <img class="city-icon" src="${icon}" alt="${
           data.list[29].weather[0]["description"]
     }">
         <figcaption>${data.list[29].weather[0]["description"]}</figcaption>
       </figure>
     `;
     li4.innerHTML = markup4;
     $(".forecast5").append(li4);
 
     const li5 = document.createElement("li");
     li5.classList.add("city");
     const markup5 = `
       <h2 class="forecast" id="date">
         <span>${forecastDayFive}</span>
       </h2>
       <div class="city-temp">${Math.round(data.list[37].main.temp)}<sup>°F</sup></div>
       <div class="humidity">Humidity ${data.list[37].main.humidity}</div>
       <figure>
         <img class="city-icon" src="${icon}" alt="${
           data.list[37].weather[0]["description"]
     }">
         <figcaption>${data.list[37].weather[0]["description"]}</figcaption>
       </figure>
     `;
     li5.innerHTML = markup5;
     $(".forecast5").append(li5);
     
   });
    
});