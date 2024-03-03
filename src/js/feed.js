var installButton = document.querySelector('#install-button');
// Get the container where the cards will be inserted
var exploreGrid = document.querySelector('.explore__grid');

function openCreatePostModal() {
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}


installButton.addEventListener('click', openCreatePostModal);



function clearCards() {
  while (exploreGrid.hasChildNodes()) {
    exploreGrid.removeChild(exploreGrid.lastChild);
  }
}

// function createCard(data) {
//   var cardWrapper = document.createElement('div');
//   cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
//   var cardTitle = document.createElement('div');
//   cardTitle.className = 'mdl-card__title';
//   cardTitle.style.backgroundImage = 'url(' + data.image + ')';
//   cardTitle.style.backgroundSize = 'cover';
//   cardTitle.style.height = '180px';
//   cardWrapper.appendChild(cardTitle);
//   var cardTitleTextElement = document.createElement('h2');
//   cardTitleTextElement.style.color = 'white';
//   cardTitleTextElement.className = 'mdl-card__title-text';
//   cardTitleTextElement.textContent = data.title;
//   cardTitle.appendChild(cardTitleTextElement);
//   var cardSupportingText = document.createElement('div');
//   cardSupportingText.className = 'mdl-card__supporting-text';
//   cardSupportingText.textContent = data.location;
//   cardSupportingText.style.textAlign = 'center';
//   // var cardSaveButton = document.createElement('button');
//   // cardSaveButton.textContent = 'Save';
//   // cardSaveButton.addEventListener('click', onSaveButtonClicked);
//   // cardSupportingText.appendChild(cardSaveButton);
//   cardWrapper.appendChild(cardSupportingText);
//   componentHandler.upgradeElement(cardWrapper);
//   sharedMomentsArea.appendChild(cardWrapper);
// }

// Create a function to generate the card
function createCard(data) {
  // Create elements
  var cardDiv = document.createElement('div');
  cardDiv.className = 'card container ' + data.class;
  cardDiv.setAttribute('data-aos', 'fade-up');
  cardDiv.setAttribute('data-aos-duration', '1000');

  var cardContentDiv = document.createElement('div');
  cardContentDiv.className = 'card__content text-center align-items-center';

  var titleParagraph = document.createElement('p');
  titleParagraph.className = 'card__title';
  titleParagraph.textContent = data.name;

  var button = document.createElement('button');
  button.className = 'button';
  button.setAttribute('slug-data', 'yyy');

  var link = document.createElement('a');
  link.href = '#'; // Update the href attribute with the appropriate URL
  link.className = 'text-decoration-none text-white';
  link.textContent = 'See Detail';

  // Append elements
  button.appendChild(link);
  cardContentDiv.appendChild(titleParagraph);
  cardContentDiv.appendChild(button);
  cardDiv.appendChild(cardContentDiv);
  exploreGrid.appendChild(cardDiv);

  
}



// // Create the card
// var strengthCard = createCard('Strength', 'gym');

// // Append the card to the container
// exploreGrid.appendChild(strengthCard);


function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = 'https://tespwa-54ec4-default-rtdb.firebaseio.com/classes.json';
var networkDataReceived = false;



fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('classes')
    .then(function (data) {
      if (!networkDataReceived) {
        // console.log(data);
        console.log('From cache', data);
        updateUI(data);
      }
    });
}

