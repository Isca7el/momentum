const time = document.querySelector(".time");
const date = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const city = document.querySelector(".city");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuote = document.querySelector(".change-quote");
const player = document.querySelector('.player');
const error = document.querySelector('.weather-error');

function showTime() {
  const today = new Date();
  time.textContent = today.toLocaleTimeString();

  showGreeting();
  showDate();
  setTimeout(showTime, 1000);
}

showTime();

function showDate() {
  const currentdate = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };
  date.textContent = currentdate.toLocaleDateString('en-US', options);
}

function getTimeOfDay() {
  const date = new Date();
  const hours = Math.ceil(date.getHours());
  const arr = ["night", "morning", "afternoon", "evening"];
  return arr[Math.floor(hours / 6)];
}
getTimeOfDay();

function showGreeting() {
  const timeOfDay = getTimeOfDay();
  const greetingText = `Good ${timeOfDay}`;
  greeting.textContent = greetingText;
}

function setLocalStorage() {
  const name = document.querySelector(".name");
  localStorage.setItem("name", name.value);
  localStorage.setItem("city", city.value);
}

window.addEventListener("beforeunload", setLocalStorage);

function getLocalStoreage() {
  const name = document.querySelector(".name");
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
  }

  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
  }
}

window.addEventListener("load", getLocalStoreage);

const body = document.querySelector("body");
const timeDay = getTimeOfDay();
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
let randomNum = getRandomNum(1, 20);

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg() {
  randomNum = String(randomNum).padStart(2, "0");
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/Isca7el/stage1-tasks/assets/image//${timeDay}/${randomNum}.webp`;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}
setBg();

function getSlideNext() {
  randomNum++;
  if (randomNum > 20) {
    randomNum = 1;
  }
  setBg();
}

function getSlideprev() {
  randomNum--;
  if (randomNum < 1) {
    randomNum = 20;
  }
  setBg();
}

slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlideprev);


city.value = "Minsk";

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.cod == 400 || data.cod == 404) {
    error.textContent = data.message;
  } else {
    error.textContent = "";
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    weatherDescription.textContent = data.weather[0].description;
    temperature.textContent = `${data.main.temp}°C`;
    wind.textContent = `Wind speed: ${data.wind.speed} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
  }
}

getWeather();

city.addEventListener('change', () => getWeather(city.value));

const quotes = "data-en.json";
function getQuotes() {
  fetch(quotes)
    .then(res => res.json())
    .then(data => {
      let len = data.length;
      let runNum = getRandomNum(0, len - 1);
      quote.textContent = data[runNum].text;
      author.textContent = data[runNum].author;
    })
}
getQuotes();
changeQuote.addEventListener('click', () => getQuotes());

const playerList = document.querySelector(".play-list");
const audio = new Audio();
let play = document.querySelector(".play");
let playNum = 0;
let isPlay = false;
const next = document.querySelector('.play-next');
const prev = document.querySelector('.play-prev');
const progressBar = document.querySelector('.progress-bar');
const trackName = document.querySelector('.track');

import playList from './playList.js';
playList.forEach((el, index) => {
  const li = document.createElement('li');

  li.classList.add('play-item');
  li.textContent = playList[index].title;
  playerList.append(li);
})

const li = document.querySelectorAll('.play-item');

function playAudio() {
  audio.src = playList[playNum].src;
  li[playNum].classList.add('item-active');
  trackName.textContent = playList[playNum].title;
}
playAudio();

playerList.addEventListener('click', (e) => {
  if (e.target) {
    toggle();
    if (!isPlay) {
      audio.play();
      isPlay = true;
    } else {
      audio.pause();
      isPlay = false;
    }
  }
})

function toggle() {
  play.classList.toggle('pause');
}

play.addEventListener('click', () => {
  if (!isPlay) {
    audio.play();
    isPlay = true;
  } else {
    audio.pause();
    isPlay = false;
  }
});

play.addEventListener('click', toggle);

function playNext() {
  li[playNum].classList.remove('item-active');
  playNum++;
  if (playNum > 3) {
    playNum = 0;
  }
  playAudio(playNum);
}
next.addEventListener('click', playNext);

function playPrev() {
  li[playNum].classList.remove('item-active');
  playNum--;
  if (playNum < 0) {
    playNum = 3;
  }
  playAudio(playNum);
}
prev.addEventListener('click', playPrev);

audio.addEventListener('ended', function () {
  playNext();
  audio.play();
});

audio.addEventListener(
  "loadeddata",
  () => {
    audioPlayer.querySelector(".time-audio .length").textContent = getTimeCodeFromNum(
      audio.duration
    );
    audio.volume = .75;
  },
  false
);

const volumeLine = player.querySelector(".volume .volume-line");
volumeLine.addEventListener('click', e => {
  const volumeLineWidth = window.getComputedStyle(volumeLine).width;
  console.log(volumeLineWidth);
  const newVolume = e.offsetX / parseInt(volumeLineWidth);
  audio.volume = newVolume;
  player.querySelector('.volume-progress').style.width = newVolume * 100 + '%';
},
  false)

const timeline = player.querySelector('.timeline');
timeline.addEventListener('click', e => {
  const timeLineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = e.offsetX / parseInt(timeLineWidth) * audio.duration;
  audio.currentTime = timeToSeek;
},
  false)

const sound = document.querySelector('.sound');

function toggleVolume() {
  sound.classList.toggle('mute');
}

sound.addEventListener('click', () => {
  toggleVolume();
  audio.muted = !audio.muted;
})

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

setInterval(() => {
  const progressBar = player.querySelector('.progress');
  progressBar.style.width = audio.currentTime / audio.duration * 100 + '%';
  player.querySelector('.time-audio .current').textContent = getTimeCodeFromNum(audio.currentTime);
}, 500)


const audioPlayer = document.querySelector('.player');
const weather = document.querySelector('.weather');
const greetingContainer = document.querySelector('.greeting-container');
const quotesContainer = document.querySelector('.quote-container');
const todoContainer = document.querySelector('.container');


const audioInput = document.querySelector('.audio-input');
const weatherInput = document.querySelector('.weather-input');
const dataInput = document.querySelector('.data-input');
const timeInput = document.querySelector('.time-input');
const greetingInput = document.querySelector('.greeting-input');
const quotesInput = document.querySelector('.quotes-input');
const todoInput = document.querySelector('.todo-input');

audioInput.addEventListener('click', () => {
  if (!audioInput.checked) {
    audioPlayer.style.opacity = 0;
  } else {
    audioPlayer.style.opacity = 1;
  }
});

weatherInput.addEventListener('click', () => {
  if (!weatherInput.checked) {
    weather.style.opacity = 0;
  } else {
    weather.style.opacity = 1;
  }
});

dataInput.addEventListener('click', () => {
  if (!dataInput.checked) {
    date.style.opacity = 0;
  } else {
    date.style.opacity = 1;
  }
})

timeInput.addEventListener('click', () => {
  if (!timeInput.checked) {
    time.style.opacity = 0;
  } else {
    time.style.opacity = 1;
  }
})

greetingInput.addEventListener('click', () => {
  if (!greetingInput.checked) {
    greetingContainer.style.opacity = 0;
  } else {
    greetingContainer.style.opacity = 1;
  }
})

quotesInput.addEventListener('click', () => {
  if (!quotesInput.checked) {
    changeQuote.style.opacity = 0;
    quotesContainer.style.opacity = 0;

  } else {
    changeQuote.style.opacity = 1;
    quotesContainer.style.opacity = 1;
  }
})


todoInput.addEventListener('click', () => {
  if (!todoInput.checked) {
    todoContainer.style.opacity = 0;

  } else {
    todoContainer.style.opacity = 1;
  }
})

const github = document.querySelector('.github');
const unsplash = document.querySelector('.unsplash');
const flick = document.querySelector('.flick');
const teg = document.querySelector('.teg');



document.querySelector('#push').onclick = function(){
  if(document.querySelector('#newtask input').value.length == 0){
      alert("Please Enter a Task")
  }
  else{
      document.querySelector('#tasks').innerHTML += `
          <div class="task">
              <span id="taskname">
                  ${document.querySelector('#newtask input').value}
              </span>
              <button class="delete">Clear</button>
          </div>`;

      var current_tasks = document.querySelectorAll(".delete");
      for(var i=0; i<current_tasks.length; i++){
          current_tasks[i].onclick = function(){
              this.parentNode.remove();
          }
      }

      var tasks = document.querySelectorAll(".task");
      for(var i=0; i<tasks.length; i++){
          tasks[i].onclick = function(){
              this.classList.toggle('completed');
          }
      }

      document.querySelector("#newtask input").value = "";
  }
}
