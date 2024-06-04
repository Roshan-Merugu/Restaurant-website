const preloader = document.querySelector("[data-preload]");
window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

const addEventOnElements = function (element, eventType, callback) {
  for (let i = 0, leng = element.length; i < leng; i++) {
    element[i].addEventListener(eventType, callback);
  }
};
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};
addEventOnElements(navToggler, "click", toggleNavbar);

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");
let lastScroll = 0;
const hideHeader = function () {
  const isScrollBottom = lastScroll < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  lastScroll = window.scrollY;
};
window.addEventListener("scroll", function () {
  if (this.window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});
const mainSlider = document.querySelector("[data-main-slider]");
const mainSliderItems = document.querySelectorAll("[data-main-slider-item]");
const mainSliderPrevBtn = document.querySelector("[data-prev-btn]");
const mainSliderNextBtn = document.querySelector("[data-next-btn]");
let currentSlidePosition = 0;
let lastActiveSlider = mainSliderItems[0];
const updateSliderPosition = function () {
  lastActiveSlider.classList.remove("active");
  mainSliderItems[currentSlidePosition].classList.add("active");
  lastActiveSlider = mainSliderItems[currentSlidePosition];
};
const nextSlider = function () {
  if (currentSlidePosition >= mainSliderItems.length - 1) {
    currentSlidePosition = 0;
  } else {
    currentSlidePosition++;
  }
  updateSliderPosition();
};
mainSliderNextBtn.addEventListener("click", nextSlider);
const prevSlider = function () {
  if (currentSlidePosition <= 0) {
    currentSlidePosition = mainSliderItems.length - 1;
  } else {
    currentSlidePosition--;
  }
  updateSliderPosition();
};
mainSliderPrevBtn.addEventListener("click", prevSlider);
const autoSlider = function () {
  autoSlideInterval = setInterval(function () {
    nextSlider();
  }, 7000);
};
addEventOnElements(
  [mainSliderNextBtn, mainSliderPrevBtn],
  "mouseover",
  function () {
    clearInterval(autoSlideInterval);
  }
);
addEventOnElements(
  [mainSliderNextBtn, mainSliderPrevBtn],
  "mouseout",
  autoSlider
);
window.addEventListener("load", autoSlider);

const parallaxItems = document.querySelectorAll("[data-parallax-item]");
let x, y;
window.addEventListener("mousemove", function (event) {
  x = (event.clientX / window.innerWidth) * 10 - 5;
  y = (event.clientY / window.innerHeight) * 10 - 5;
  x = x - x * 2;
  y = y - y * 2;
  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px,${y}px,0px)`;
  }
});

//Firebase code

// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getDatabase,
  set,
  get,
  ref,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyABHVE0c3dxWvojoYNCnnI76anugh0O-4w",
  authDomain: "restaurant-7a427.firebaseapp.com",
  projectId: "restaurant-7a427",
  storageBucket: "restaurant-7a427.appspot.com",
  messagingSenderId: "660822506868",
  appId: "1:660822506868:web:55d71ad0625f1864dd8021",
  measurementId: "G-HXE86PGG6C",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function writeUserData(
  userID,
  name,
  phone,
  person,
  reservationDate,
  time,
  message
) {
  set(ref(db, "data/" + userID), {
    name: name,
    phone: phone,
    person: person,
    reservationDate: reservationDate,
    time: time,
    message: message,
  });
}

function updateLastUserID(newUserID) {
  set(ref(db, "lastUserID"), newUserID);
}

async function getNextUserID() {
  const lastUserIDRef = ref(db, "lastUserID");
  const snapshot = await get(lastUserIDRef);
  let lastUserID = snapshot.exists() ? snapshot.val() : 0;
  let newUserID = lastUserID + 1;

  await set(lastUserIDRef, newUserID);
  return newUserID;
}

document
  .getElementById("btn-submit")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get form elements
    const nameInput = document.querySelector('input[name="name"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    const personSelect = document.querySelector('select[name="person"]');
    const reservationDateInput = document.querySelector(
      'input[name="reservation-date"]'
    );
    const timeInput = document.querySelector("#time-options");
    const messageInput = document.querySelector('textarea[name="message"]');

    const name = nameInput.value;
    const phone = phoneInput.value;
    const person = personSelect.value;
    const reservationDate = reservationDateInput.value;
    const time = timeInput.value;
    const message = messageInput.value;

    // Get the next user ID
    const newUserID = await getNextUserID();

    // Write user data with the new user ID
    writeUserData(
      newUserID,
      name,
      phone,
      person,
      reservationDate,
      time,
      message
    );

    // Log each form field separately
    console.log("Name:", name);
    console.log("Phone:", phone);
    console.log("Number of Persons:", person);
    console.log("Reservation Date:", reservationDate);
    console.log("Time:", time);
    console.log("Message:", message);

    // Clear input fields
    nameInput.value = '';
    phoneInput.value = '';
    personSelect.value = '';
    reservationDateInput.value = '';
    timeInput.value = '';
    messageInput.value = '';

    // Show confirmation popup
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
            <i class="fa-regular fa-circle-check"></i>
            <p>Your reservation is <b>CONFIRMED</b></p>
            <hr class="dotted-line">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Persons:</strong> ${person}</p>
            <p><strong>ReservationDate:</strong> ${reservationDate}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Message:</strong> ${message}</p>
            <hr class="dotted-line">
            <p><b>See you soon!</b></p>
    `;
    document.body.appendChild(popup);
    setTimeout(function () {
      document.body.removeChild(popup);
    }, 3000);
  });


async function readData() {
  const userRef = ref(db, "data");
  const snapshot = await get(userRef);
  snapshot.forEach((childSnapshot) => {
    console.log(childSnapshot.val());
  });
}
readData();
