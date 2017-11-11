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
    <div>
      <a class="modelLink" value="${imageUid}"><img value="${imageUid}" src="${imageUrl}" ></a>
    </div>
  `;
  $('.models').append(sketchfabModelElement);
  $('.modelLink').on('click', function(event){
    let uid = event.target;
    let uidValue = $(uid).attr('value')
      results.forEach(result => {
        let clickedModel = result.thumbnails.images[3].uid
        console.log(`the event target uid is ${uidValue}`);
        console.log(`clickedModel is ${clickedModel}`)
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
}

function watchSubmit(){
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val("");
    getDataFromSketchfabApi(query, callbackSketchfab)
  })
}

$(watchSubmit);
