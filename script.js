function play() {
  const guess = document.getElementById("guess").value;
  const resultText = document.getElementById("result");

  const coin = Math.random() < 0.5 ? "орёл" : "решка";

  if (guess === coin) {
    resultText.textContent = `Вы угадали! Это ${coin}! 🎉`;
    resultText.style.color = "limegreen";
  } else {
    resultText.textContent = `Не угадали... Это был ${coin} 😢`;
    resultText.style.color = "red";
  }
}
