#!/bin/bash
BASE="https://showcase.codethislab.com/games/park_your_car"
DIR="$(dirname "$0")"

dl() {
    local url="$BASE/$1"
    local dest="$DIR/$1"
    mkdir -p "$(dirname "$dest")"
    if [ ! -f "$dest" ]; then
        echo "Downloading $1"
        wget -q -O "$dest" "$url" || echo "FAILED: $1"
    else
        echo "Skipping (exists): $1"
    fi
}

# Preloader sprites
dl "sprites/progress_bar.png"
dl "sprites/200x200.jpg"

# Main sprites
dl "sprites/asphalt.jpg"
dl "sprites/but_play.png"
dl "sprites/but_restart.png"
dl "sprites/msg_box.png"
dl "sprites/bg_menu.png"
dl "sprites/logo.png"
dl "sprites/baloon_mc.png"
dl "sprites/bg_preloader.jpg"
dl "sprites/steering_wheel.png"
dl "sprites/wheel_bar.png"
dl "sprites/accelerator.png"
dl "sprites/breacker.png"
dl "sprites/wheel.png"
dl "sprites/but_fullscreen.png"
dl "sprites/but_credits.png"
dl "sprites/logo_ctl.png"
dl "sprites/but_no.png"
dl "sprites/but_yes.png"
dl "sprites/rear_light.png"
dl "sprites/healt.png"
dl "sprites/energy_bar.png"
dl "sprites/arrow_keys.png"
dl "sprites/help_touch.png"
dl "sprites/but_exit.png"
dl "sprites/audio_icon.png"
dl "sprites/time.png"
dl "sprites/level_sprite.png"
dl "sprites/but_continue.png"

# Level sprites (10 levels: 0-9)
for i in $(seq 0 9); do
    dl "sprites/levels/level${i}/bg_game.jpg"
    dl "sprites/levels/level${i}/fg_game.png"
    dl "sprites/levels/level${i}/lights.png"
done

# Cars (1-18)
for i in $(seq 1 18); do
    dl "sprites/cars/car${i}_mc.png"
done

# Containers (1-8)
for i in $(seq 1 8); do
    dl "sprites/container/container${i}.png"
done

# Bars (1-4)
for i in $(seq 1 4); do
    dl "sprites/bar/bar${i}.png"
done

# Dividers (1-3)
for i in $(seq 1 3); do
    dl "sprites/divider/divider${i}.png"
done

# Flowers (1-2)
for i in $(seq 1 2); do
    dl "sprites/flowers/flowers${i}.png"
done

# Garbage bins (1-3)
for i in $(seq 1 3); do
    dl "sprites/garbage_bin/garbage_bin${i}.png"
done

# Houses (1-5)
for i in $(seq 1 5); do
    dl "sprites/house/house${i}.png"
done

# Boxes (1-2)
for i in $(seq 1 2); do
    dl "sprites/box/box${i}.png"
done

# Select car (1-4)
for i in $(seq 1 4); do
    dl "sprites/select_car/select_car_${i}.png"
done

# Sidewalks (1-6)
for i in $(seq 1 6); do
    dl "sprites/sidewalk/sidewalk_${i}.png"
done

# Trash (1-2)
for i in $(seq 1 2); do
    dl "sprites/trash/trash${i}.png"
done

# Drop areas (1-4)
for i in $(seq 1 4); do
    dl "sprites/drop_area/drop_area_${i}.png"
done

# Sounds
dl "sounds/car_parked.mp3"
dl "sounds/but_press.mp3"
dl "sounds/crash.mp3"
dl "sounds/select_car.mp3"
dl "sounds/arrival_lose.mp3"
dl "sounds/arrival_win.mp3"
dl "sounds/soundtrack.mp3"

echo "Done!"
