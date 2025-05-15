// ключ, для получения данных с сайта weatherapi.com
const apiKey = "b9c5e18b72504fe7b9700143251505";

let currentUnit = "metric"; // 'metric' = Цельсий, 'imperial' = Фаренгейт

// функция при клике на "Найти"
document
  .getElementById("locationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Чтобы страница не перезагружалась

    // получаем то, что пользователь ввел
    const location = document.getElementById("weatherLocation").value;

    // если не пустое, продолжаем
    if (location !== "") {
      // получаем погоду
      getWeather(location);
    }
  });

// переключение ц и ф
document.getElementById("changeUnit").addEventListener("click", function () {
  // если были в цельсиях — переключаем на фаренгейты, и наоборот
  if (currentUnit === "metric") {
    currentUnit = "imperial";
  } else {
    currentUnit = "metric";
  }

  // получаем текущий текст в поле ввода
  const location = document.getElementById("weatherLocation").value;

  if (location !== "") {
    // повторно получаем данные о погоде с новыми единицами
    getWeather(location);
  }
});

// главная функция, которая получает данные и показывает их
function getWeather(location) {
  // создание ссылки на сервер с нужными параметрами
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

  // запрашиваем данные с сервера
  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Ошибка при получении данных");
      }
      return response.json();
    })
    .then(function (data) {
      // обрабатываем полученные данные
      const weather = extractImportantData(data);
      // показываем данные на странице
      showWeather(weather);
    })
    .catch(function (error) {
      console.log("Ошибка:", error);
    });
}

// здесь функция берет только нужные данные из всего ответа
function extractImportantData(data) {
  return {
    city: data.location.name + ", " + data.location.country,
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
    tempC: data.current.temp_c,
    tempF: data.current.temp_f,
    feelsC: data.current.feelslike_c,
    feelsF: data.current.feelslike_f,
  };
}

// эта функция показывает погоду на странице
function showWeather(weather) {
  // выбираем нужные значения в зависимости от выбранной единицы
  let temperature = currentUnit === "metric" ? weather.tempC : weather.tempF;
  let feels = currentUnit === "metric" ? weather.feelsC : weather.feelsF;
  let symbol = currentUnit === "metric" ? "°C" : "°F";

  document.getElementById("weatherDisplay").innerHTML = `
    <h2>${weather.city}</h2>
    <img src="https:${weather.icon}" alt="${weather.condition}">
    <p>${weather.condition}</p>
    <p>Temperature: ${temperature}${symbol}</p>
    <p>Feels like: ${feels}${symbol}</p>
  `;
}
