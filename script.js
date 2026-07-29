const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

const img = document.querySelector(".map img");

let playerLine = [];
let drawing = false;

const questions = [
  {
    name: "赤道",
    position: 0.56
  },
  {
    name: "北回帰線",
    position: 0.465
  },
  {
    name: "南回帰線",
    position: 0.65
  }
];

let questionNumber = 0;



canvas.addEventListener("mousedown", function(e) {
  drawing = true;

  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);

  playerLine.push({
    x: e.offsetX,
    y: e.offsetY
  });
});

canvas.addEventListener("mouseup", function() {
  drawing = false;
});

canvas.addEventListener("mouseleave", function() {
  drawing = false;
});

canvas.addEventListener("mousemove", function(e) {
  if (!drawing) return;

  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  playerLine.push({
    x: e.offsetX,
    y: e.offsetY
  });

  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("touchstart", function(e) {

  e.preventDefault();

  drawing = true;

  const rect = canvas.getBoundingClientRect();

  let x = e.touches[0].clientX - rect.left;
  let y = e.touches[0].clientY - rect.top;

  ctx.beginPath();
  ctx.moveTo(x, y);

  playerLine.push({
    x: x,
    y: y
  });

});


canvas.addEventListener("touchmove", function(e) {

  e.preventDefault();

  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();

  let x = e.touches[0].clientX - rect.left;
  let y = e.touches[0].clientY - rect.top;


  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";

  ctx.lineTo(x, y);
  ctx.stroke();


  playerLine.push({
    x: x,
    y: y
  });


  ctx.beginPath();
  ctx.moveTo(x, y);

}, { passive: false });


canvas.addEventListener("touchend", function() {

  drawing = false;

});

function judge() {

  const correctY = canvas.height * questions[questionNumber].position;

  let totalError = 0;
  let count = 0;

  for (let point of playerLine) {

    let error = Math.abs(point.y - correctY);

    totalError += error;
    count++;

  }

  if (count === 0) {
    document.getElementById("result").innerHTML =
      "線を引いてください";
    return;
  }

  let averageError = totalError / count;

  let xValues = playerLine.map(p => p.x);

  let lineLength = Math.max(...xValues) - Math.min(...xValues);

  let lengthBonus = Math.min(100, lineLength / canvas.width * 100);

  let positionScore = Math.max(0, 100 - averageError);

  let score = (positionScore * 0.7) + (lengthBonus * 0.3);

  document.getElementById("result").innerHTML =
    "あなたの点数：" + score.toFixed(1) + "点";
    showCorrectLine();
}

img.onload = function() {
  canvas.width = img.clientWidth;
  canvas.height = img.clientHeight;
};


function showQuestion() {
  document.getElementById("question").innerHTML =
    "問題：" + questions[questionNumber].name + "を引いてください";
}

showQuestion();



function nextQuestion() {

  questionNumber++;

  if (questionNumber >= questions.length) {
    questionNumber = 0;
  }

  playerLine = [];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  showQuestion();
}

function showCorrectLine() {
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;

  let y = canvas.height * questions[questionNumber].position;

  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(canvas.width, y);
  ctx.stroke();
}
