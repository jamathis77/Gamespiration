//This creates the viewer. The urlid changes the model in the viewer
function viewer(urlid){
  var iframe = document.getElementById( 'api-frame' );
  var version = '1.0.0';
  //urlid is the searchterm
  var urlid = 'be685250dd8f463d8c7d29cdf28b9c05';
  console.log(typeof urlid)
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

function renderSketchfabModels(modelLink, modelUid){
  const sketchfabModelElement = `
    <div>
      <a class="modelLink" value="${modelUid}"><img value="${modelUid}" src="${modelLink}" ></a>
    </div>
  `;
  $('.models').append(sketchfabModelElement);
  $('.modelLink').on('click', function(event){
    console.log(event.target)
    let uid = event.target;
    console.log($(this).attr('value'));
    // let model =
    viewer($(this).attr('value'))
  })
}

function callbackSketchfab(response){
  response.results.forEach(result => {
    const uid = result.thumbnails.images[3]['uid'];
    const url = result.thumbnails.images[3]['url'];
    const models = result.thumbnails.images;

    models.forEach(modelLink => {
      if(modelLink.url === url){
        renderSketchfabModels(url , uid)
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
