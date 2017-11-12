//This creates the viewer. The urlid changes the model in the viewer
function viewer(urlid){
  var iframe = document.getElementById( 'api-frame' );
  var version = '1.0.0';
  //urlid is the searchterm
  var urlid = urlid;
  console.log(urlid)
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

//giantbomb.com api key e7729b1f9985d919624e31f7c1b2cabe1354aee7
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

function renderSketchfabModels(imageUrl, imageUid, results){
  const sketchfabModelElement = `

      <a class="modelLink" value="${imageUid}"><img class="modelImage" value="${imageUid}" src="${imageUrl}" ></a>

  `;
  $('.models').append(sketchfabModelElement);
  $('.modelLink').on('click', function(event){
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

function callbackSketchfab(response){
  const results = response.results;
  response.results.forEach(result => {
    const uid = result.thumbnails.images[3]['uid'];
    const url = result.thumbnails.images[3]['url'];
    // const modelUid = result.uid;
    const models = result.thumbnails.images;
    models.forEach(modelLink => {
      if(modelLink.url === url){
        renderSketchfabModels(url, uid, results)
      }
    })
  });
  viewer(results[0].uid)
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

  // if(document.body.contains(hasSearchElement)){
  //   hasSearchElement.remove();
  // }
  // if($('.videos').length){
  //   hasSearchElement.remove()
  // }
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

function watchSubmit(){
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val("");
    const hasSearchElement = $('.search-result-block');
    const hasModelLink = $('.modelLink');
    if($('.videos').length){
      hasSearchElement.remove();
    }
    if($('.models').length){
      hasModelLink.remove();
    }
    getDataFromSketchfabApi(query, callbackSketchfab);
    getYouTubeApi(query, callbackYouTubeSearchData);

  })
}

$(watchSubmit);
