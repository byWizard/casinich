let balance = 1000;

const firebaseConfig = {
  apiKey: "AIzaSyDhMfbhd7emAXNKDexXxaCxZ0k2DfkRcVg",
  authDomain: "my-games-app-hub.firebaseapp.com",
  databaseURL: "https://my-games-app-hub-default-rtdb.firebaseio.com",
  projectId: "my-games-app-hub",
  storageBucket: "my-games-app-hub.firebasestorage.app",
  messagingSenderId: "251367004030",
  appId: "1:251367004030:web:2b1be1b1c76ee80c0d052f",
  measurementId: "G-ZDJ96FX596"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Обновление баланса
function updateBalance() {
  document.getElementById("balance").textContent = balance;
}

// Обновление лидерборда
function updateLeaderboard(name, score) {
  const userRef = db.ref("users/" + name);
  userRef.set({
    name: name,
    score: score,
    timestamp: Date.now()
  });

  const leaderboardList = document.getElementById("leaderboard-list");
  db.ref("users/").on("value", (snapshot) => {
    const users = [];
    snapshot.forEach((childSnapshot) => {
      users.push(childSnapshot.val());
    });
    users.sort((a, b) => b.score - a.score);

    leaderboardList.innerHTML = "";
    users.slice(0, 5).forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.name} — ${user.score}$`;
      leaderboardList.appendChild(li);
    });
  });
}

// Онлайн-чат
function handleChatInput(e) {
  if (e.key === "Enter") {
    const input = document.getElementById("chat-input");
    const msg = input.value.trim();
    if (msg !== "") {
      db.ref("chat/").push({
        user: document.getElementById("username").textContent,
        message: msg,
        time: Date.now()
      });
      input.value = "";
    }
  }
}

db.ref("chat/").on("value", (snapshot) => {
  const chatBox = document.getElementById("chat-messages");
  chatBox.innerHTML = "";
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    const div = document.createElement("div");
    div.textContent = `${data.user}: ${data.message}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
});

// Игра в монету
function playCoin() {
  const guess = document.getElementById("guess").value;
  const bet = parseInt(document.getElementById("bet").value);
  const resultText = document.getElementById("result");

  if (isNaN(bet) || bet <= 0 || bet > balance) {
    resultText.textContent = "Введите корректную ставку!";
    return;
  }

  balance -= bet;
  updateBalance();

  setTimeout(() => {
    const coin = Math.random() < 0.5 ? "орёл" : "решка";
    if (guess === coin) {
      balance += bet * 2;
      resultText.textContent = `Вы угадали! Это ${coin}! Выиграли ${bet * 2}$ 🎉`;
    } else {
      resultText.textContent = `Не повезло... Это был ${coin} 😢`;
    }
    updateBalance();
    updateLeaderboard(document.getElementById("username").textContent, balance);
  }, 500);
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

  animateWheel(() => {
    const winNumber = Math.floor(Math.random() * 37);
    if (winNumber === guess) {
      const winAmount = bet * 36;
      balance += winAmount;
      resultText.textContent = `🎉 Поздравляем! Выпало число ${winNumber}. Вы выиграли ${winAmount}$!`;
    } else {
      resultText.textContent = `❌ Не угадали. Выпало число ${winNumber}.`;
    }
    updateBalance();
    updateLeaderboard(document.getElementById("username").textContent, balance);
  });
}

// Рисование рулетки
function animateWheel(callback) {
  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  let angle = 0;
  const targetAngle = Math.random() * 360 + 1080;

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

// Слоты
function playSlots() {
  const icons = ["💎", "⭐", "🔔"];
  const slot1 = icons[Math.floor(Math.random() * icons.length)];
  const slot2 = icons[Math.floor(Math.random() * icons.length)];
  const slot3 = icons[Math.floor(Math.random() * icons.length)];

  document.getElementById("slot1").textContent = slot1;
  document.getElementById("slot2").textContent = slot2;
  document.getElementById("slot3").textContent = slot3;

  const resultText = document.getElementById("slots-result");
  if (slot1 === slot2 && slot2 === slot3) {
    resultText.textContent = "🎉 Джекпот! Все совпали!";
    balance += 100;
  } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
    resultText.textContent = "✨ Совпадение!";
    balance += 20;
  } else {
    resultText.textContent = "❌ Попробуйте ещё раз.";
  }

  updateBalance();
  updateLeaderboard(document.getElementById("username").textContent, balance);
}
