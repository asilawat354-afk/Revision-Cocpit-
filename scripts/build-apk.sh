#!/bin/bash
set -e

echo "=== 1. Building Vite Production Bundle ==="
npm run build

echo "=== 2. Setting up APK Build Directory ==="
BUILD_DIR="/tmp/apk-build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/src/com/smartrevision/cockpit"
mkdir -p "$BUILD_DIR/bin"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/res/mipmap-hdpi"
mkdir -p "$BUILD_DIR/res/mipmap-mdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xhdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xxhdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xxxhdpi"
mkdir -p "$BUILD_DIR/assets"

echo "=== 3. Generating Android Resources & Icons ==="
python3 - << 'PYEOF'
import zlib, struct, os

def create_icon(size, out_path):
    raw_data = bytearray()
    center = size / 2.0
    radius = size * 0.46
    inner_radius = size * 0.22
    
    for y in range(size):
        raw_data.append(0) # filter None
        for x in range(size):
            dx = x - center
            dy = y - center
            dist = (dx*dx + dy*dy) ** 0.5
            if dist <= radius:
                # Rounded shield/cockpit circle with indigo/blue color
                if dist <= inner_radius:
                    raw_data.extend([255, 255, 255]) # White center
                else:
                    ratio = (dist - inner_radius) / (radius - inner_radius)
                    r = int(59 * (1 - ratio) + 30 * ratio)
                    g = int(130 * (1 - ratio) + 41 * ratio)
                    b = int(246 * (1 - ratio) + 59 * ratio)
                    raw_data.extend([r, g, b])
            else:
                raw_data.extend([28, 25, 23]) # Stone-900 background

    compressed = zlib.compress(bytes(raw_data), 9)
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc))
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc))
    iend_crc = zlib.crc32(b'IEND')
    png.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc))

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'wb') as f:
        f.write(png)

build_dir = "/tmp/apk-build"
create_icon(48, f"{build_dir}/res/mipmap-mdpi/ic_launcher.png")
create_icon(72, f"{build_dir}/res/mipmap-hdpi/ic_launcher.png")
create_icon(96, f"{build_dir}/res/mipmap-xhdpi/ic_launcher.png")
create_icon(144, f"{build_dir}/res/mipmap-xxhdpi/ic_launcher.png")
create_icon(192, f"{build_dir}/res/mipmap-xxxhdpi/ic_launcher.png")
print("Icons generated for all densities.")
PYEOF

cat << 'EOF' > "$BUILD_DIR/res/values/strings.xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Smart Revision Cockpit</string>
</resources>
