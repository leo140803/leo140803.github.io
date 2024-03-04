var installButton = document.querySelector('#install-button');
// Get the container where the cards will be inserted
var exploreGrid = document.querySelector('.explore__grid');
var CACHE_STATIC_NAME = 'static-v10';

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




function createCard(data) {
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
  button.id = data.slug;

  button.setAttribute('slug-data', data.slug);


  var link = document.createElement('a');
  link.href = '#'; 
  link.className = 'text-decoration-none text-white';
  link.textContent = 'See Detail';

  // Append elements
  button.appendChild(link);
  cardContentDiv.appendChild(titleParagraph);
  cardContentDiv.appendChild(button);
  cardDiv.appendChild(cardContentDiv);
  exploreGrid.appendChild(cardDiv);

  button.addEventListener('click', function () {
    clicked(data.slug);
  });


}



function clicked(slug) {
  var url = 'https://detail-1127b-default-rtdb.asia-southeast1.firebasedatabase.app/details/' + slug + '.json';

  if (!localStorage.getItem(slug)) {
    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        networkDataReceived = true;
        localStorage.setItem('now', JSON.stringify(data));
        console.log(data);
        localStorage.setItem(slug, JSON.stringify(data));
        
        window.location.href = '/detail.html'; 
      })
      .catch(function (error) {
        console.error('Fetch error:', error);
        window.location.href = '/offline.html'; 
      });
  } else {
    window.location.href = '/detail.html';
  }
}


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



