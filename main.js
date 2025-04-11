document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Apply header image if enabled
    if (config.headerImage && config.headerImage.enabled) {
        setupHeaderImages();
    } else {
        // Hide the header image container if not enabled
        const headerImage = document.getElementById('header-image');
        if (headerImage) {
            headerImage.style.display = 'none';
        }
    }
    
    // Load content based on configuration
    loadContent();
});

function setupHeaderImages() {
    const headerContainer = document.getElementById('header-image');
    const images = config.headerImage.images || [];
    
    // If no images or only one image, use the simple approach
    if (!images.length || !Array.isArray(images)) {
        // Fallback to original single image behavior
        const imagePath = config.headerImage.path || 'images/header.jpg';
        const altText = config.headerImage.altText || 'Header image';
        headerContainer.style.backgroundImage = `url('${imagePath}')`;
        headerContainer.setAttribute('aria-label', altText);
        return;
    }
    
    // Clear any existing slides
    headerContainer.innerHTML = '';
    
    // Create slides for each image
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = `header-slide ${index === 0 ? 'active' : ''}`;
        
        // Add error handling for image loading
        const img = new Image();
        img.onload = function() {
            // Image loaded successfully
            slide.style.backgroundImage = `url('${image.path}')`;
        };
        img.onerror = function() {
            console.error(`Failed to load image: ${image.path}`);
            // Use a fallback color or placeholder
            slide.style.backgroundColor = '#f0f0f0';
            slide.innerHTML = `<div style="padding: 20px; text-align: center;">Image not found: ${image.path}</div>`;
        };
        img.src = image.path;
        
        slide.setAttribute('aria-label', image.altText || `Header image ${index + 1}`);
        headerContainer.appendChild(slide);
    });
    
    // Set up animation if enabled and if more than one image
    if (config.headerImage.animation && config.headerImage.animation.enabled && images.length > 1) {
        // Get animation settings or use defaults
        const interval = config.headerImage.animation.interval || 5000;
        const transitionSpeed = config.headerImage.animation.transitionSpeed || 1000;
        
        // Set the transition speed
        const slides = document.querySelectorAll('.header-slide');
        slides.forEach(slide => {
            slide.style.transition = `opacity ${transitionSpeed}ms ease-in-out`;
        });
        
        // Start the animation
        let currentSlide = 0;
        setInterval(() => {
            const slides = document.querySelectorAll('.header-slide');
            if (slides.length > 1) {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }
        }, interval);
    }
}

async function loadContent() {
    showLoading(true);
    
    try {
        if (config.contentSource === 'files') {
            await loadContentFromFiles();
        } else if (config.contentSource === 'googleSheet') {
            await loadContentFromGoogleSheet();
        } else {
            console.error('Invalid content source in config');
        }
    } catch (error) {
        console.error('Error loading content:', error);
        document.querySelector('main').innerHTML = '<p>Error loading content. Please check the console for details.</p>';
    } finally {
        showLoading(false);
    }
}

async function loadContentFromFiles() {
    for (const [section, filePath] of Object.entries(config.files)) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            
            const sectionElement = document.getElementById(section);
            if (sectionElement) {
                sectionElement.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading section ${section}:`, error);
        }
    }
}

async function loadContentFromGoogleSheet() {
    const sheetId = config.googleSheet.sheetId;
    const sections = ['about', 'research', 'publications', 'teaching', 'contact'];
    
    for (const section of sections) {
        try {
            // Google Sheets API URL for published sheets
            const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${section}`;
            
            const response = await fetch(sheetUrl);
            if (!response.ok) throw new Error(`Failed to load sheet: ${section}`);
            
            const text = await response.text();
            // Parse the weird Google response format (strip "google.visualization.Query.setResponse(" and trailing ");")
            const jsonText = text.substring(47, text.length - 2);
            const data = JSON.parse(jsonText);
            
            // Process content based on the section type
            let htmlContent = '';
            if (section === 'publications') {
                htmlContent = processPublicationsSheet(data);
            } else {
                htmlContent = processGenericSheet(data);
            }
            
            const sectionElement = document.getElementById(section);
            if (sectionElement) {
                sectionElement.innerHTML = htmlContent;
            }
        } catch (error) {
            console.error(`Error loading section ${section} from Google Sheet:`, error);
        }
    }
}

function processGenericSheet(data) {
    // Extract rows from Google's response format
    const rows = data.table.rows;
    let htmlContent = '';
    
    rows.forEach(row => {
        const cells = row.c;
        // Skip empty rows
        if (!cells || cells.every(cell => !cell || !cell.v)) return;
        
        // First cell is assumed to be the type (heading, paragraph, etc.)
        const type = cells[0]?.v;
        const content = cells[1]?.v;
        
        if (type && content) {
            switch(type.toLowerCase()) {
                case 'title':
                    htmlContent += `<h2>${content}</h2>`;
                    break;
                case 'subtitle':
                    htmlContent += `<h3>${content}</h3>`;
                    break;
                case 'paragraph':
                    htmlContent += `<p>${content}</p>`;
                    break;
                case 'link':
                    const url = cells[2]?.v;
                    htmlContent += `<p><a href="${url}" target="_blank">${content}</a></p>`;
                    break;
            }
        }
    });
    
    return htmlContent;
}

function processPublicationsSheet(data) {
    const rows = data.table.rows;
    let htmlContent = '<h2>Publications</h2><ul class="publications-list">';
    
    rows.forEach(row => {
        const cells = row.c;
        // Skip header or empty rows
        if (!cells || !cells[0] || cells[0].v === 'title' || !cells[0].v) return;
        
        const title = cells[0]?.v || '';
        const authors = cells[1]?.v || '';
        const venue = cells[2]?.v || '';
        const year = cells[3]?.v || '';
        const link = cells[4]?.v || '';
        
        htmlContent += `
            <li class="publication">
                <strong>${title}</strong><br>
                ${authors}<br>
                ${venue} (${year})
                ${link ? `<br><a href="${link}" target="_blank">Link</a>` : ''}
            </li>
        `;
    });
    
    htmlContent += '</ul>';
    return htmlContent;
}

function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = show ? 'block' : 'none';
}
