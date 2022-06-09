const SIZE = {
  UNSPECIFIED: 'THUMBNAIL_SIZE_UNSPECIFIED',
  LARGE: 'LARGE',
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
};

const IMAGE_SIZE = SIZE.SMALL;
const MAX_SLIDE_COUNT = 1;
const PRESENTATION_ID = '1rPb9jfzOsTwmGYXM4nBnjuE51dcXexYaNvu9KPSQEVQ';
const FOLDER_ID = '1iCG9Qu0JLFx2b9O1ohROTyMo-95FqD4K';


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
    let presentation2 = SlidesApp.openById(presentationId);

    const presentation = Slides.Presentations.get(presentationId);
    const slides = presentation.slides;

    let thumbnailUrls = [];
    for ( let i = 0; i < MAX_SLIDE_COUNT; i++) {
      fixFont(presentation2.getSlides()[i], 'title', 'short stuf');
      //fixFont(presentation2.getSlides()[i], 'title', 'this is a pretty long string it probably will not fit');
      //fixFont(presentation2.getSlides()[i], 'title', 'this is a medium long string');
      let objectId = slides[i].objectId;
      let thumbnailUrl = getThumbnailUrl(presentationId, objectId);
      thumbnailUrls.push({
        objectId: objectId,
        thumbnailUrl: thumbnailUrl
      });
    }
    return thumbnailUrls;
  };


  let approxChars = (width, height, fontsize) => {
    let numRows = Math.trunc(height / (fontsize * 1.2));
    let charsPerRow = Math.trunc((width / fontsize) / 0.6);
    console.log('numRows: ' + numRows + ' charsPerRow: ' + charsPerRow)
    let numChars = numRows.toFixed(0) * charsPerRow.toFixed(0);
    return numChars;
  }


  let fixFont = (currentSlide, textPlaceholder, replacementText) => {

    let fontSizes = [96, 72, 60, 48, 36, 30, 24];
    
    let listOfElements = currentSlide.getPageElements();
    for (let i=0; i < listOfElements.length; i++) {

      let objectElementType = listOfElements[i].getPageElementType();

      // Filter step 1: filter for 'Shape' element type since textboxes are designated as shapes
        if(objectElementType.toString() == 'SHAPE') {
          Logger.log('found shape')
          let shape = listOfElements[i].asShape();
          let objectText = shape.getText();

          Logger.log(objectText.asString());
        
          // Filter step 2: filter for shape whose text matches the placeholder string (e.g., 'Title' == 'Title')
          if(objectText.asString().trim() == textPlaceholder) {
            let baselineObjectHeight = shape.getHeight().toFixed(2);
            let baselineObjectWidth = shape.getWidth().toFixed(2);

            Logger.log('Object Text is: '+ objectText.asString());
            Logger.log('Baseline height is: '+ baselineObjectHeight);
            Logger.log('Baseline width is: '+ baselineObjectWidth);

            let textChars = replacementText.length;
            let fontSize = 96;
            for (let j = 0; j < fontSizes.length; j++) {
              fontSize = fontSizes[j];
              let numChars = approxChars(baselineObjectWidth, baselineObjectHeight, fontSize);
              Logger.log('textChars: ' + textChars + ', numChars: ' + numChars);
              if (numChars > textChars) {
                break;
              }
            }
            
            // if (textChars > numChars) {
              // let scaleFactor = numChars / textChars;
              // Logger.log('scaleFactor: ' + scaleFactor);
              // let newFontSize = scaleFactor * fontSize;
              // //let newFontSize = 2872.01 - 2696.25 * Math.pow(textChars, 0.00926896);
              // //let newFontSize = 113.597 - (0.670927 * textChars);
              // Logger.log(newFontSize);
              // newFontSize = newFontSize.toFixed(0);
              // Logger.log(newFontSize);
              objectText.setText('');
              let insertedText = objectText.appendText(replacementText);
              insertedText.getTextStyle().setFontSize(fontSize);

            // }

            break;
          }
        }
    }

}


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
