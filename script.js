let balance = 1000;

function playCoin() {
  const guess = document.getElementById("guess").value;
  const bet = parseInt(document.getElementById("bet").value);
  const resultText = document.getElementById("result");
  const winSound = document.getElementById("winSound");
  const clickSound = document.getElementById("clickSound");

  if (isNaN(bet) || bet <= 0 || bet > balance) {
    resultText.textContent = "Введите корректную ставку!";
    resultText.style.color = "orange";
    return;
  }

  balance -= bet;
  clickSound.play();

  const coin = Math.random() < 0.5 ? "орёл" : "решка";

  setTimeout(() => {
    if (guess === coin) {
      balance += bet * 2;
      resultText.textContent = `Вы угадали! Это ${coin}! Выиграли ${bet * 2}$ 🎉`;
      resultText.style.color = "limegreen";
      winSound.play();
    } else {
      resultText.textContent = `Не повезло... Это был ${coin} 😢`;
      resultText.style.color = "red";
    }
    updateBalance();
  }, 500);
}

function updateBalance() {
  document.getElementById("balance").textContent = balance;
}

// Рулетка
function spinRoulette() {
  const guess = parseInt(document.getElementById("roulette-guess").value);
  const bet = parseInt(document.getElementById("roulette-bet").value);
  const resultText = document.getElementById("roulette-result");

  if (isNaN(guess) || isNaN(bet) || bet <= 0 || guess < 0 || guess > 36 || bet > balance) {
    resultText.textContent = "Введите корректные данные.";
    return;
  }

  balance -= bet;
  updateBalance();

  // Анимация вращения колеса
  animateWheel(() => {
    const winNumber = Math.floor(Math.random() * 37);
    if (winNumber === guess) {
      const winAmount = bet * 36;
      balance += winAmount;
      resultText.textContent = `🎉 Поздравляем! Выпало число ${winNumber}. Вы выиграли ${winAmount}$!`;
      document.getElementById("winSound").play();
    } else {
      resultText.textContent = `❌ Не угадали. Выпало число ${winNumber}.`;
    }
    updateBalance();
  });
}

// Анимация вращения колеса
function animateWheel(callback) {
  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  let angle = 0;
  const targetAngle = Math.random() * 360 + 1080; // Минимум 3 оборота

  function drawFrame() {
    angle += 10;
    drawWheel(ctx, angle % 360);
    if (angle < targetAngle) {
      requestAnimationFrame(drawFrame);
    } else {
      callback();
    }
  }

  requestAnimationFrame(drawFrame);
}

// Рисование рулетки
function drawWheel(ctx, angle) {
  const centerX = 200;
  const centerY = 200;
  const radius = 180;
  const segments = 37;
  const segmentAngle = 360 / segments;

  ctx.clearRect(0, 0, 400, 400);

  for (let i = 0; i < segments; i++) {
    const start = ((i * segmentAngle) + angle) * Math.PI / 180;
    const end = ((i + 1) * segmentAngle + angle) * Math.PI / 180;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, start, end);
    ctx.fillStyle = i % 2 === 0 ? "#ff4444" : "#000";
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(((i * segmentAngle + segmentAngle / 2 + angle) * Math.PI / 180));
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "12px Orbitron";
    ctx.fillText(i.toString(), radius - 10, 5);
    ctx.restore();
  }

  // Стрелка
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius - 10);
  ctx.lineTo(centerX - 10, centerY - radius + 10);
  ctx.lineTo(centerX + 10, centerY - radius + 10);
  ctx.closePath();
  ctx.fillStyle = "#ffff00";
  ctx.fill();
}
