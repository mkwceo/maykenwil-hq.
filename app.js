/* ============================================================
   Maykenwil HQ — dashboard (slider branches, famille, roadmap,
   priorités, lecteur d'ambiance). Base : ecemgo (CodePen), adaptée.
   ============================================================ */

/* nav active */
const navItems = document.querySelectorAll(".nav-item");
navItems.forEach((navItem) => {
  navItem.addEventListener("click", (e) => {
    const link = navItem.querySelector("a");
    if (link && link.getAttribute("href") && link.getAttribute("href") !== "#") return; // vrais liens
    e.preventDefault();
    const active = document.querySelector(".nav-item.active");
    if (active) active.classList.remove("active");
    navItem.classList.add("active");
  });
});

/* drag horizontal sur les conteneurs */
document.querySelectorAll(".containers").forEach((container) => {
  let isDragging = false, startX, scrollLeft;
  container.addEventListener("mousedown", (e) => { isDragging = true; startX = e.pageX - container.offsetLeft; scrollLeft = container.scrollLeft; });
  container.addEventListener("mousemove", (e) => { if (!isDragging) return; e.preventDefault(); const x = e.pageX - container.offsetLeft; container.scrollLeft = scrollLeft - (x - startX) * 0.6; });
  container.addEventListener("mouseup", () => { isDragging = false; });
  container.addEventListener("mouseleave", () => { isDragging = false; });
});

/* lecteur d'ambiance */
const progress = document.getElementById("progress");
const song = document.getElementById("song");
const controlIcon = document.getElementById("controlIcon");
const playPauseButton = document.querySelector(".play-pause-btn");
const forwardButton = document.querySelector(".controls button.forward");
const backwardButton = document.querySelector(".controls button.backward");
const rotatingImage = document.getElementById("rotatingImage");
const songName = document.querySelector(".music-player h2");
const artistName = document.querySelector(".music-player .track-artist");

let rotating = false, currentRotation = 0, rotationInterval;

const songs = [
  { title: "Redemption", name: "Besomorph & Coopex", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Besomorph-Coopex-Redemption.mp3", cover: "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/398875d0-9b9e-494a-8906-210aa3f777e0" },
  { title: "What's The Problem?", name: "OSKI", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/OSKI-Whats-The-Problem.mp3", cover: "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/810d1ddc-1168-4990-8d43-a0ffee21fb8c" },
  { title: "Control", name: "Unknown Brain x Rival", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Unknown-BrainxRival-Control.mp3", cover: "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/7bd23b84-d9b0-4604-a7e3-872157a37b61" },
];
let currentSongIndex = 0;

function startRotation() { if (!rotating) { rotating = true; rotationInterval = setInterval(rotateImage, 50); } }
function pauseRotation() { clearInterval(rotationInterval); rotating = false; }
function rotateImage() { currentRotation += 1; rotatingImage.style.transform = `rotate(${currentRotation}deg)`; }

function updateSongInfo() {
  songName.textContent = songs[currentSongIndex].title;
  artistName.textContent = songs[currentSongIndex].name;
  song.src = songs[currentSongIndex].source;
  rotatingImage.src = songs[currentSongIndex].cover;
}

if (song) {
  song.addEventListener("loadedmetadata", function () { progress.max = song.duration; progress.value = song.currentTime; });
  song.addEventListener("ended", function () { currentSongIndex = (currentSongIndex + 1) % songs.length; updateSongInfo(); playPause(); });
  song.addEventListener("timeupdate", function () { if (!song.paused) progress.value = song.currentTime; });
}

function playPause() {
  if (song.paused) { song.play(); controlIcon.classList.add("fa-pause"); controlIcon.classList.remove("fa-play"); startRotation(); }
  else { song.pause(); controlIcon.classList.remove("fa-pause"); controlIcon.classList.add("fa-play"); pauseRotation(); }
}

if (playPauseButton) playPauseButton.addEventListener("click", playPause);
if (progress) {
  progress.addEventListener("input", function () { song.currentTime = progress.value; });
  progress.addEventListener("change", function () { song.play(); controlIcon.classList.add("fa-pause"); controlIcon.classList.remove("fa-play"); startRotation(); });
}
if (forwardButton) forwardButton.addEventListener("click", function () { currentSongIndex = (currentSongIndex + 1) % songs.length; updateSongInfo(); playPause(); });
if (backwardButton) backwardButton.addEventListener("click", function () { currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; updateSongInfo(); playPause(); });

updateSongInfo();

/* slider coverflow */
if (window.Swiper) {
  new Swiper(".swiper", {
    effect: "coverflow", grabCursor: true, centeredSlides: true, loop: true, speed: 600, slidesPerView: "auto",
    coverflowEffect: { rotate: 10, stretch: 120, depth: 200, modifier: 1, slideShadows: false },
    pagination: { el: ".swiper-pagination" },
  });
}
