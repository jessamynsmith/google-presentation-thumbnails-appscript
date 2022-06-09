# google-presentation-thumbnails-appscript

### Development

Fork the project on github and git clone your fork, e.g.:

    git clone https://github.com/<username>/google-presentation-thumbnails-appscript.git
    
You will need a Google Cloud Project with the following:

    - Google Slides and Sheets API enabled
    - A Google presentation which has granted access to the generated email on the service account

Edit the script to set the appropriate values for const IMAGE_SIZE, MAX_SLIDE_COUNT, PRESENTATION_ID, and FOLDER_ID.

Create an Apps Script 
Copy and paste the contents of get_slide_thumbnails.js into Google Apps Script
Run the script
