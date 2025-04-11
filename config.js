// Configuration for content loading
const config = {
    // Choose content source: 'files' or 'googleSheet'
    contentSource: 'files',
    
    // Header image configuration
    headerImage: {
        enabled: true,
        // Animation settings
        animation: {
            enabled: true,
            interval: 5000, // Time between image changes (milliseconds)
            transitionSpeed: 1000, // Transition animation speed (milliseconds)
        },
        // Array of images to display in the header
        images: [
            {
                path: 'images/header1.jpg',
                altText: 'Header image 1'
            },
            {
                path: 'images/header2.jpg',
                altText: 'Header image 2'
            },
            {
                path: 'images/header3.jpg',
                altText: 'Header image 3'
            }
        ]
    },
    
    // Configuration for file-based content
    files: {
        about: 'content/about.md',
        research: 'content/research.md',
        publications: 'content/publications.md',
        teaching: 'content/teaching.md',
        contact: 'content/contact.md',
    },
    
    // Configuration for Google Sheet-based content
    googleSheet: {
        // Replace with your published Google Sheet ID
        sheetId: '1YourGoogleSheetIDHere',
        // The published sheet should have these tabs/sheets:
        // about, research, publications, teaching, contact
    }
};
