let blackjackGame = {
  you: { scoreSpan: "#your-blackjack-result", div: "#your-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    score: 0,
  },
  card: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  trunsOver: false,
};

document
  .getElementById("blackjack-hit-button")
  .addEventListener("click", blackJackHit);
document
  .getElementById("blackjack-stand-button")
  .addEventListener("click", dealerLogic);

document
  .getElementById("blackjack-deal-button")
  .addEventListener("click", blackjackDeal);

const sound = new Audio("blackjackStatic/sounds/swish.mp3");
const winSound = new Audio("blackjackStatic/sounds/cash.mp3");
const lossSound = new Audio("blackjackStatic/sounds/aww.mp3");

function blackJackHit() {
  if (blackjackGame.isStand === false) {
    let card = randomCard();
    updateScore(blackjackGame.you, card);
    showScore(blackjackGame.you);
    showcard(blackjackGame.you, card);
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["card"][randomIndex];
}

function showcard(activePlayer, card) {
  console.log("jsgfjhg", activePlayer);

  if (activePlayer["score"] <= 21) {
    console.log(activePlayer);

    let ele = document.createElement("img");
    ele.setAttribute("src", `blackjackStatic/images/${card}.png`);
    document.querySelector(activePlayer["div"]).appendChild(ele);
    sound.play();
  }
}

function blackjackDeal() {
  if (blackjackGame.trunsOver === true) {
    blackjackGame.isStand = false;
    console.log(blackjackGame.isStand);

    let yourImages = document
      .getElementById("your-box")
      .querySelectorAll("img");
    let dealerImages = document
      .getElementById("dealer-box")
      .querySelectorAll("img");

    for (i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    document.getElementById("your-blackjack-result").textContent = 0;
    blackjackGame.you.score = 0;
    document.getElementById("dealer-blackjack-result").textContent = 0;
    blackjackGame.dealer.score = 0;

    document.querySelector("#your-blackjack-result").style.color = "#ffffff";
    document.querySelector("#dealer-blackjack-result").style.color = "#ffffff";

    document.getElementById("blackjack-result").textContent = "let's play";
    document.querySelector("#blackjack-result").style.color = "black";
    blackjackGame.trunsOver = true;
    console.log(blackjackGame.trunsOver);
  }
}

function updateScore(activePlayer, card) {
  console.log("jhjsgdh", activePlayer["score"]);
  console.log(card);
  if (card === "A") {
    console.log("jhjsgdh", activePlayer.score);
    //if adding 11 keeps me below 21 , add 21 , otherwise, add 1
    if (activePlayer["score"] + blackjackGame.cardsMap[card][1] <= 21) {
      activePlayer["score"] += blackjackGame.cardsMap[card][1];
      console.log("in if", activePlayer["score"]);
    } else {
      activePlayer["score"] += blackjackGame.cardsMap[card][0];
      console.log("in else", activePlayer["score"]);
    }
  } else {
    activePlayer["score"] += blackjackGame.cardsMap[card];
    console.log(activePlayer["score"]);
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dealerLogic() {
  blackjackGame.isStand = true;
  while (blackjackGame.dealer.score < 16 && blackjackGame.isStand === true) {
    let card = randomCard();
    showcard(blackjackGame.dealer, card);
    updateScore(blackjackGame.dealer, card);
    showScore(blackjackGame.dealer);
    await sleep(1000);
  }
  blackjackGame.trunsOver = true;
  let a = computeWinner();
  showResult(a);
  console.log(blackjackGame.trunsOver);
}

//compute winner and return who just won
//update ths wins ,draws, and losses
function computeWinner() {
  let winner;

  if (blackjackGame.you.score <= 21) {
    //condition higher score then dealer or when dealer busts but you're not
    if (
      blackjackGame.you.score > blackjackGame.dealer.score ||
      blackjackGame.dealer.score > 21
    ) {
      blackjackGame.wins++;
      winner = blackjackGame.you;
    } else if (blackjackGame.you.score < blackjackGame.dealer.score) {
      blackjackGame.losses++;
      winner = blackjackGame.dealer;
    } else if (blackjackGame.you.score === blackjackGame.dealer.score) {
      blackjackGame.draws++;
    }
    //condition: when user busts but dealer doesn't
  } else if (blackjackGame.you.score > 21 && blackjackGame.dealer.score <= 21) {
    blackjackGame.losses++;

    winner = blackjackGame.dealer;

    //condition : when you and dealer busts
  } else if (blackjackGame.you.score > 21 && blackjackGame.dealer.score > 21) {
    blackjackGame.draws++;
  }

  console.log(blackjackGame);
  return winner;
}

function showResult(winner) {
  let message, messageColor;
  if (blackjackGame.trunsOver === true) {
    if (winner === blackjackGame.you) {
      document.querySelector("#wins").textContent = blackjackGame.wins;
      message = "you won!";
      messageColor = "green";
      winSound.play();
    } else if (winner === blackjackGame.dealer) {
      document.querySelector("#losses").textContent = blackjackGame.losses;

      message = "you lost!";
      messageColor = "red";
      lossSound.play();
    } else {
      document.querySelector("#draws").textContent = blackjackGame.draws;

      message = "you drew";
      messageColor = "black";
    }

    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
  }
}
