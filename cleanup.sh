#!/bin/bash

# Cleanup script for simplified website
# This script removes unnecessary files and keeps only the files needed for the new website structure

# Set the base directory
BASE_DIR="/home/kabir/Work/Website/202504/kabirhusain.github.io"
cd "$BASE_DIR" || { echo "Cannot access base directory"; exit 1; }

echo "Starting website cleanup process..."

# Create a temporary directory to hold essential files
echo "Creating temporary storage for essential files..."
mkdir -p temp/content

# Copy essential files to the temp directory
echo "Backing up essential files..."
cp index.html styles.css config.js main.js README.md temp/ 2>/dev/null || echo "Some core files not found, will be created later"
cp -r content temp/ 2>/dev/null || echo "Content directory not found, will be created"

# Check if images directory exists and backup any existing images
if [ -d "images" ]; then
    echo "Backing up images..."
    mkdir -p temp/images
    cp -r images/* temp/images/ 2>/dev/null
fi

# Remove all files except the temp directory and git data
echo "Removing unnecessary files..."
find . -maxdepth 1 -not -name '.' -not -name '..' -not -name '.git' -not -name 'temp' -not -name 'cleanup.sh' -exec rm -rf {} \;

# Restore essential files from temp directory
echo "Restoring essential files..."
cp -r temp/* .

# Create directories if they don't exist
echo "Creating necessary directories..."
mkdir -p content images

# Check and restore content files
if [ ! "$(ls -A content 2>/dev/null)" ]; then
    echo "Content directory was empty or not found, creating sample content files..."
    
    # Create sample about.md if it doesn't exist
    if [ ! -f "content/about.md" ]; then
        cat > content/about.md << 'EOL'
## About Me

I am Kabir Husain, a researcher in [your field]. This is my personal academic website.

My research focuses on [your research areas]. I am currently affiliated with [your institution/organization].

[Add more personal information as needed]

### Education
- PhD in [Field], [University], [Year]
- MS in [Field], [University], [Year]
- BS in [Field], [University], [Year]
EOL
    fi
    
    # Create sample research.md if it doesn't exist
    if [ ! -f "content/research.md" ]; then
        cat > content/research.md << 'EOL'
## Research

My research interests include:

### [Research Area 1]
Description of your first research area.

### [Research Area 2]
Description of your second research area.

### Current Projects
- **Project 1**: Brief description of the project
- **Project 2**: Brief description of the project
EOL
    fi
    
    # Create sample publications.md if it doesn't exist
    if [ ! -f "content/publications.md" ]; then
        cat > content/publications.md << 'EOL'
## Publications

### Journal Articles

1. **Article Title 1**  
   Author List including Kabir Husain  
   *Journal Name*, Year  
   [Link to paper](#)

2. **Article Title 2**  
   Author List including Kabir Husain  
   *Journal Name*, Year  
   [Link to paper](#)

### Conference Proceedings

1. **Paper Title 1**  
   Author List including Kabir Husain  
   *Conference Name*, Year  
   [Link to paper](#)
EOL
    fi
    
    # Create sample teaching.md if it doesn't exist
    if [ ! -f "content/teaching.md" ]; then
        cat > content/teaching.md << 'EOL'
## Teaching

### Current Courses

- **Course Title 1** (Course Code)  
  Institution, Semester/Year  
  Brief description of the course

- **Course Title 2** (Course Code)  
  Institution, Semester/Year  
  Brief description of the course

### Past Courses

- **Course Title 3** (Course Code)  
  Institution, Semester/Year
EOL
    fi
    
    # Create sample contact.md if it doesn't exist
    if [ ! -f "content/contact.md" ]; then
        cat > content/contact.md << 'EOL'
## Contact

Email: your.email@example.com

Office: Building Name, Room Number  
Institution/University  
Address  
City, State, Zip Code

### Social Media / Professional Profiles

- [Google Scholar](#)
- [LinkedIn](#)
- [Twitter](#)
- [GitHub](#)
EOL
    fi
fi

# Create placeholder header images if they don't exist
echo "Checking header images..."
for i in {1..3}; do
    if [ ! -f "images/header$i.jpg" ]; then
        echo "Creating placeholder for header$i.jpg (you should replace this with an actual image)"
        convert -size 1200x400 canvas:lightblue -gravity Center -pointsize 30 -annotate 0 "Header Image $i\nReplace with your own image" "images/header$i.jpg" 2>/dev/null || 
        echo "Could not create placeholder image. You'll need to add your own images to the 'images' directory."
    fi
done

# Clean up temp directory
echo "Cleaning up temporary files..."
rm -rf temp

echo "Website cleanup complete!"
echo "Your website now has a simplified structure. You can add your own header images to the 'images' directory."
echo "To see your website locally, run: python -m http.server"

# Make the script executable
chmod +x cleanup.sh
