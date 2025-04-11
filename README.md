# Simple Academic Website

This is a simplified personal academic website that can be updated in two ways:

1. By modifying Markdown files in the `/content` directory
2. By updating a Google Sheet (with proper setup)

## File-based Updates (Default)

1. Navigate to the `/content` directory
2. Edit the markdown files for the section you want to update:
   - `about.md`
   - `research.md`
   - `publications.md`
   - `teaching.md`
   - `contact.md`
3. Save the files and deploy the site

## Google Sheet-based Updates

1. Create a Google Sheet with the following tabs/sheets:
   - `about`
   - `research`
   - `publications`
   - `teaching`
   - `contact`
2. For general tabs, use columns:
   - Column A: Type (title, subtitle, paragraph, link)
   - Column B: Content
   - Column C: URL (for links only)
3. For the publications tab:
   - Column A: Title
   - Column B: Authors
   - Column C: Venue
   - Column D: Year
   - Column E: Link URL
4. Publish your Google Sheet to the web:
   - File > Share > Publish to web
   - Choose "Entire document"
   - Click Publish
   - Copy the sheet ID from the URL (the long string between /d/ and /edit)
5. Update the `config.js` file:
   - Set `contentSource` to 'googleSheet'
   - Update `sheetId` with your Google Sheet ID

## Customization

- Edit `styles.css` to customize the appearance
- Modify `index.html` to change the page structure
- Update `config.js` to switch between content sources
