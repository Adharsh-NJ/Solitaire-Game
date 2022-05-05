//creating playing cards
//placing cards on play area
let playAreaContainerElements = document.querySelector("#playAreaContainer").children
let drawCardContainer = document.querySelector("#drawCardHolder")
let finalCards = document.querySelector("#finalCardsContainer").children
let drawCard = document.querySelector("#drawCard")
let winContainerElement = document.querySelector("#winContainer")
let restartButtonElement = document.querySelector("#restartButton")
let shuffledCards;
let draggedItems = [];

restartButtonElement.addEventListener("click", () => {
  window.location.reload()
  winContainerElement.style.display = "none"
})

drawCardContainer.addEventListener("click", () => {
  if (drawCardContainer.lastElementChild) {
    let lastChild = drawCardContainer.lastElementChild
    drawCard.appendChild(lastChild)
  } else {
    drawCardContainer.append(...Array.from(drawCard.childNodes).reverse())
  }
})

let fetchCards = async () => {
  let fetchId = await (await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")).json()
  let deckId = fetchId.deck_id
  let fetchCards = await (await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`)).json()
  shuffledCards = fetchCards.cards;
  createCards()
}
fetchCards()

let createCards = () => {
  shuffledCards.map((value, index) => {
    let card = document.createElement("div")
    let image = document.createElement("img")
    switch (value.value) {
      case "ACE": {
        card.dataset.value = 1
        break;
      }
      case "KING": {
        card.dataset.value = 13
        break;
      }
      case "QUEEN": {
        card.dataset.value = 12
        break;
      }
      case "JACK": {
        card.dataset.value = 11
        break;
      }
      default: {
        card.dataset.value = value.value
      }
    }
    card.dataset.suit = value.suit;
    card.dataset.color = value.suit === "SPADES" || value.suit === "CLUBS" ? "black" : "red";
    image.setAttribute("src", value.images.png)
    card.setAttribute("draggable", "true")
    card.addEventListener("dragstart", dragStart)
    card.classList.add("card")
    card.append(image)
    appendCards(card, index)
  })
}

let appendCards = (card, index) => {
  if (index === 0) {
    playAreaContainerElements[0].append(card)
  } else if (index > 0 && index < 3) {
    playAreaContainerElements[1].append(card)
  } else if (index > 2 && index < 6) {
    playAreaContainerElements[2].append(card)
  } else if (index > 5 && index < 10) {
    playAreaContainerElements[3].append(card)
  } else if (index > 9 && index < 15) {
    playAreaContainerElements[4].append(card)
  } else if (index > 14 && index < 21) {
    playAreaContainerElements[5].append(card)
  } else if (index > 20 && index < 28) {
    playAreaContainerElements[6].append(card)
  } else {
    drawCardContainer.append(card)
  }
}

function dragStart() {
  draggedItems = []
  let elem = this;
  draggedItems.push(elem)
  while (elem.nextSibling) {
    elem = elem.nextSibling
    draggedItems.push(elem)
  }
}

for (let item of playAreaContainerElements) {
  item.addEventListener("dragover", dragOver)
  item.addEventListener("drop", dropCard)
}

function dragOver(e) {
  let lastElement = this.lastElementChild
  if (lastElement) {
    lastElement.dataset.value == +draggedItems[0].dataset.value + 1 && lastElement.dataset.color !== draggedItems[0].dataset.color && e.preventDefault()
  } else {
    draggedItems[0].dataset.value == 13 && e.preventDefault()
  }
}

function dropCard() {
  this.append(...draggedItems)
  let childCount = this.childElementCount - (+this.id)
  childCount = childCount <= 0 ? 1 : childCount;
  childCount = this.childElementCount === 0 ?0:childCount;
  draggedItems.length === 1 ? draggedItems[0].style.transform = `translateY(${childCount * 2.5}rem)` :
    draggedItems.map((value, index) => {
      if (childCount === 0 && index === 0) {
        value.style.transform = `translateY(${0 * 2.5}rem)`
      } else {
        value.style.transform = `translateY(${(index + 1) * 2.5}rem)`
      }
    })
}

for (let item of finalCards) {
  item.addEventListener("dragover", finalDragOver)
  item.addEventListener("drop", finalDrop)
}

function finalDragOver(e) {
  let lastElement = this.lastElementChild
  if (lastElement) {
    draggedItems[0].dataset.value == +lastElement.dataset.value + 1 && lastElement.dataset.suit === draggedItems[0].dataset.suit && draggedItems.length === 1 && e.preventDefault()
  } else {
    this.childElementCount === 0 && draggedItems[0].dataset.value === "1" && e.preventDefault()//if finalContainer empty
  }
}

function finalDrop() {
  this.append(draggedItems[0])
  checkWin()
}

function checkWin() {
  let winStatus;
  for (let item of finalCards) {
    if (item.lastElementChild.value === "13") {
      winStatus = true;
    } else {
      winStatus = false;
      break;
    }
  }
  if (winStatus) {
    winContainerElement.style.display = "flex";
  }
}