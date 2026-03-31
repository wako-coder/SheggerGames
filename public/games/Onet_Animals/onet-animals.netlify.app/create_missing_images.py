#!/usr/bin/env python3
"""
Script to create missing images for the Onet Animals game
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_background_image():
    """Create a background image similar to what the game expects"""
    # Create a 720x1080 background image
    img = Image.new('RGB', (720, 1080), color='lightblue')
    draw = ImageDraw.Draw(img)
    
    # Add a simple gradient-like effect
    for y in range(1080):
        # Calculate a color that gets slightly darker toward the bottom
        color_val = int(200 - (y / 1080) * 50)  # From ~200 to ~150
        draw.line([(0, y), (720, y)], fill=(color_val, 200, 255))
    
    # Save the image
    img.save('img/background.png')
    print("Created img/background.png")

def create_game_title_image():
    """Create a game title image"""
    # Create a title image (approximate size based on game layout)
    img = Image.new('RGB', (400, 100), color='white')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple title text
    try:
        # Try to use a default font
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
    except:
        # Fallback to default font if specific font not available
        font = ImageFont.load_default()
    
    # Draw centered text
    text = "ONET ANIMALS"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (400 - text_width) // 2
    y = (100 - text_height) // 2
    
    draw.text((x, y), text, fill='black', font=font)
    
    # Save the image
    img.save('img/game_title.png')
    print("Created img/game_title.png")

if __name__ == "__main__":
    # Change to the game directory
    os.chdir('/home/wak/Documents/projects/practice/laravel/SheggerGames/public/games/Onet_Animals/onet-animals.netlify.app')
    
    # Create the missing images
    create_background_image()
    create_game_title_image()
    
    print("All missing images created successfully!")