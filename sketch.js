const images = ['FFL 4.jpg', 'FFL 12.jpeg', 'FFL 8.png'];
let previousIndex = localStorage.getItem('previousImageIndex');
let randomIndex;

// Ensure the new image is different from the previous one
do {
    randomIndex = Math.floor(Math.random() * images.length);
} while (randomIndex == previousIndex);

localStorage.setItem('previousImageIndex', randomIndex);
const selectedImage = images[randomIndex];

const image = new Image();
image.src = selectedImage;
image.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 10000;
    const detail = 1;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let grid = [];
    for (let y = 0; y < canvas.height; y += detail){
        let row = [];
        for (let x = 0; x < canvas.width; x += detail){
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
            const color = 'rgb(' + red +',' + green + ',' + blue + ')';
            const brightness = calculateBrightness(red, green, blue) / 100;
            const cell = {
                cellColor: color,
                cellBrightness: brightness,
            };
            row.push(cell);
        }  
        grid.push(row); 
    }

    class Particle {
        constructor(){
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.speed = 0;
            this.velocity = Math.random() * 0.8; // Adjusted velocity for a thinner pattern
            this.size = Math.random() * 2 + 0.2;
            this.position1 = Math.floor(this.y / detail);
            this.position2 = Math.floor(this.x / detail);
            this.angle = 0;
        }
        update () {
            this.position1 = Math.floor(this.y / detail);
            this.position2 = Math.floor(this.x / detail);
            if (grid[this.position1] && grid[this.position1][this.position2]) {
                this.speed = grid[this.position1][this.position2].cellBrightness;
            }
            this.angle += this.speed / 20;
            let movement = (2.5 - this.speed) + this.velocity;
            this.y -= movement + Math.cos(this.angle) * 1.5; // Adjusted movement for a thinner pattern
            this.x += Math.cos(this.angle) * 1.5; // Adjusted movement for a thinner pattern
            if (this.y <= 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        draw(){
            ctx.beginPath();
            ctx.fillStyle = 'white';
            if (this.y > canvas.height - this.size * 6) ctx.globalAlpha = 0;
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function init(){
        for (let i = 0; i < numberOfParticles; i++){
            particlesArray.push(new Particle());
        }
    }
    init();

    function animate () {
        ctx.globalAlpha = 0.03;
        ctx.fillStyle = 'rgb(0, 0, 0)'; // Change background color to black
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            ctx.globalAlpha = particlesArray[i].speed * 0.2;
            particlesArray[i].draw();
        }
        requestAnimationFrame( animate );
    }
    animate();

    function calculateBrightness(red, green, blue){
        return Math.sqrt(
            (red * red) * 0.299 +
            (green * green) * 0.587 +
            (blue * blue) * 0.114
        );
    }
});

const quotes = [
    "The day healthcare can fully embrace AI is the day we have a revolution in terms of cutting costs and improving care.",
    "The tools and technologies we've developed are really the first few drops of water in the vast ocean of what AI can do.",
    "I believe in the future of AI changing the world. The question is, who is changing AI? It is really important to bring diverse groups of students and future leaders into the development of AI.",
    "The tools and technologies we've developed are really the first few drops of water in the vast ocean of what AI can do.",
    "I believe in the future of AI changing the world. The question is, who is changing AI? It is really important to bring diverse groups of students and future leaders into the development of AI.",
    "As a technologist, I see how AI and the fourth industrial revolution will impact every aspect of people's lives.",
    "There's a great phrase, written in the '70s: 'The definition of today's AI is a machine that can make a perfect chess move while the room is on fire.' It really speaks to the limitations of AI. In the next wave of AI research, if we want to make more helpful and useful machines, we've got to bring back the contextual understanding.",
];

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function displayRandomQuote() {
    const textDisplay = document.getElementById('textDisplay');
    textDisplay.textContent = getRandomQuote();
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('hidden');
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('hidden');
}

function refreshPage() {
    location.reload();
}

function showText() {
    const textDisplay = document.getElementById('textDisplay');
    let currentQuote = textDisplay.textContent.trim();
    let newQuote;
    do {
        newQuote = getRandomQuote();
    } while (newQuote === currentQuote);
    textDisplay.innerHTML = `${newQuote}<br><br>Fei Fei Li`;
    textDisplay.classList.remove('hidden');
}

let isMusicPlaying = false;

function playMusic() {
    const audio = document.getElementById('audio');
    if (isMusicPlaying) {
        audio.pause();
    } else {
        audio.play();
        audio.loop = true;
    }
    isMusicPlaying = !isMusicPlaying; // Toggle the state
}
