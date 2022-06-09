const SIZE = {
  UNSPECIFIED: 'THUMBNAIL_SIZE_UNSPECIFIED',
  LARGE: 'LARGE',
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
};

const IMAGE_SIZE = SIZE.SMALL;
const MAX_SLIDE_COUNT = 1;
const PRESENTATION_ID = '<PRESENTATION_ID_FROM_GOOGLE_URL>';
const FOLDER_ID = '<FOLDER_ID_FROM_GOOGLE_URL>';


function mainFunction() {

  const getThumbnailUrl = (presentationId, objectId) => {
    let thumbnail = Slides.Presentations.Pages.getThumbnail(
        presentationId,
        objectId,
        {
          'thumbnailProperties.mimeType': 'PNG',
          'thumbnailProperties.thumbnailSize': IMAGE_SIZE,
        }
      );
    return thumbnail.contentUrl;
  };


  const getImageLinks = (presentationId) => {

    const presentation = Slides.Presentations.get(presentationId);
    const slides = presentation.slides;

    let thumbnailUrls = [];
    for ( let i = 0; i < MAX_SLIDE_COUNT; i++) {
      let objectId = slides[i].objectId;
      let thumbnailUrl = getThumbnailUrl(presentationId, objectId);
      thumbnailUrls.push({
        objectId: objectId,
        thumbnailUrl: thumbnailUrl
      });
    }
    return thumbnailUrls;
  };


  let imageLinks = getImageLinks(PRESENTATION_ID);

  for ( let i = 0; i < imageLinks.length; i++) {
    let blob = UrlFetchApp.fetch(
        imageLinks[i].thumbnailUrl
      )
        .getBlob()
        .setName(`page${("000" + (i + 1)).slice(-3)}.png`);
    DriveApp.getFolderById(FOLDER_ID).createFile(blob);
  }
  
}
