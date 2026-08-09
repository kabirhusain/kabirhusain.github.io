// Configuration for content loading
const config = {
    // Choose content source: 'files' or 'googleSheet'
    contentSource: 'files',

    // Header image configuration
    headerImage: {
        enabled: true,
        path: 'images/header1.jpg',
        altText: 'Header image'
    },

    // Configuration for file-based content
    files: {
        research: 'content/research.md',
        group: 'content/group.md',
        publications: 'content/publications.md',
        contact: 'content/contact.md',
    },

    // Configuration for Google Sheet-based content
    googleSheet: {
        // Replace with your published Google Sheet ID
        sheetId: '1YourGoogleSheetIDHere',
        // The published sheet should have these tabs/sheets:
        // research, group, publications, contact
    }
};
