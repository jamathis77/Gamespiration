

//This creates the 3D model viewer. The urlid controls which model is in the viewer
function viewer(urlid){
  var iframe = document.getElementById( 'api-frame' );
  var version = '1.0.0';
  //urlid is the searchterm that is passed in as the argument
  var urlid = urlid;
  var client = new Sketchfab( version, iframe );

  client.init( urlid, {
      success: function onSuccess( api ){
          api.start();
          api.addEventListener( 'viewerready', function() {

              // API is ready to use
              // Insert your code here
              console.log( 'Viewer is ready' );

          } );
      },
      error: function onError() {
          console.log( 'Viewer error' );
      }
  } );
}

//ajax call to sketchfab for the 3d model.
function getDataFromSketchfabApi(searchWord, callback){
  const settings = {
    url: 'https://api.sketchfab.com/v3/search',
    data: {
      type: 'models',
      q: searchWord
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  }

  $.ajax(settings)
}
//callback function for sketchfab ajax
function callbackSketchfab(response){
  let counter = 0;
  $('.carousel-item').remove();
  const results = response.results;
  response.results.forEach(result => {
    const uid = result.thumbnails.images[3]['uid'];
    const url = result.thumbnails.images[3]['url'];
    const models = result.thumbnails.images;
    models.forEach(modelLink => {

      if(modelLink.url === url){
        counter++;
        renderSketchfabModels(url, uid, results, counter)

      }
    })

  });
  //sends the first model to the viewer when a search is executed

  viewer(results[0].uid)


}

function renderSketchfabModels(imageUrl, imageUid, results, counter){
  const sketchfabModelElementActive = `
  <div class="carousel-item active">
    <a class="modelLink" value="${imageUid}"><img class="d-block img-fluid modelImage" value="${imageUid}" src="${imageUrl}" ></a>
  </div>
  `;

  const sketchfabModelElement = `
  <div class="carousel-item">
    <a class="modelLink" value="${imageUid}"><img class="d-block modelImage" value="${imageUid}" src="${imageUrl}" ></a>
  </div>
  `;
  console.log(`counter is ${counter}`)
  if(counter === 1){
    $('.carousel-inner').append(sketchfabModelElementActive);
  }else{
    $('.carousel-inner').append(sketchfabModelElement);
  }

  // Adds ability to change model by clicking
  $('.modelLink').on('click', function(event){
    console.log('clicked');
    let uid = event.target;
    let uidValue = $(uid).attr('value')
      results.forEach(result => {
        let clickedModel = result.thumbnails.images[3].uid
        if(uidValue === clickedModel){
          viewer(result.uid)
        }
      })
  })
}

function getYouTubeApi(searchWord, callback){
  const settings = {
    url: 'https://www.googleapis.com/youtube/v3/search',
    data: {
      key: 'AIzaSyAQ0OepoUveleF_qPGSeKe8FxumuHc2eHQ',
      q: `video game ${searchWord}`,
      part: 'snippet'
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings)
}

function renderResult(title, thumbnail, link){
  const searchElement = `
    <div class="search-result-block">
      <a href="https://www.youtube.com/watch?v=${link}">
        <img class="youtubeImage" src="${thumbnail}" alt="description of thumbnail">
      </a>
      <p class="youtubeTitle">${title}</p>
    </div>
  `;
  $('.videos').append(searchElement);
}

//callback function for YouTube API
function callbackYouTubeSearchData(response){
  response.items.forEach(item => {
    const youTubeName = item.snippet.title;
    const youTubeThumbnail = item.snippet.thumbnails.medium.url;
    const youTubeLink = item.id.videoId;
    renderResult(youTubeName, youTubeThumbnail, youTubeLink)
  })
}

// function getSliderSettings(){
//   return {
//     dots: true,
//     infinite: true,
//     speed: 300,
//     slidesToShow: 1,
//     centerMode: true,
//     variableWidth: true
//   }
// }

// $.ajax({
//   type: 'get',
//   url: '/public/index',
//   dataType: 'script',
//   data: data_send,
//   success: function() {
//     $('.models').slick('unslick'); /* ONLY remove the classes and handlers added on initialize */
//     // $('.my-slide').remove(); /* Remove current slides elements, in case that you want to show new slides. */
//     $('.models').slick(getSliderSettings()); /* Initialize the slick again */
//   }
// });

// function addSlick(){
//   console.log('slick has run')
//
//     $('.models').slick({
//       dots: true,
//       infinite: true,
//       speed: 300,
//       slidesToShow: 1,
//       centerMode: true,
//       variableWidth: true
//
//   });
// }

function watchSubmit(){

  $('.js-search-form').submit(event => {
    let counter = 0;
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val("");
    const hasSearchElement = $('.search-result-block');
    const hasModelLink = $('.modelLink');
    if(counter === 0){
      $("section").removeClass("hidden")
      $("iframe").removeClass("hidden")
    }
    if($('.videos').length){
      hasSearchElement.remove();
    }
    if($('.models').length){
      hasModelLink.remove();
    }
    counter++;
    // $('.slider').slick('unslick');
    getDataFromSketchfabApi(query, callbackSketchfab);
    getYouTubeApi(query, callbackYouTubeSearchData);

  })
}

$(watchSubmit);
