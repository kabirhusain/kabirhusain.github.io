#!/bin/bash

# Create the images directory if it doesn't exist
mkdir -p /home/kabir/Work/Website/202504/kabirhusain.github.io/images

# Check if the images exist, if not create placeholder images
for i in {1..3}; do
    IMAGE_PATH="/home/kabir/Work/Website/202504/kabirhusain.github.io/images/header$i.jpg"
    if [ ! -f "$IMAGE_PATH" ]; then
        echo "Creating placeholder image: $IMAGE_PATH"
        # Create a placeholder image with text (requires ImageMagick)
        # If you don't have ImageMagick, you'll need to manually create these images
        command -v convert >/dev/null 2>&1 || { echo "ImageMagick not found. Please install it or create the images manually."; exit 1; }
        convert -size 1200x675 canvas:lightblue -font Arial -pointsize 50 -gravity center -annotate 0 "Header Image $i" "$IMAGE_PATH"
    else
        echo "Image already exists: $IMAGE_PATH"
    fi
done

echo "Images directory and placeholder images have been set up."
echo "Please replace the placeholder images with your actual banner images."
