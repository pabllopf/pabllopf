#!/bin/bash

cd ../../../

# 📦 Directorio base
BASE_DIR="."

# 🎨 Colores para salida
GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m" # Sin color

# 🧭 Buscar archivos de imagen
find "$BASE_DIR" -type f \( \
    -iname "*.png" -o \
    -iname "*.jpg" -o \
    -iname "*.jpeg" -o \
    -iname "*.bmp" -o \
    -iname "*.tiff" -o \
    -iname "*.gif" \
\) | while read -r file; do

    dir=$(dirname "$file")
    name=$(basename "$file")
    base="${name%.*}"
    output="$dir/$base.webp"

    # Evitar reconvertir WebP
    [[ "$file" == *.webp ]] && continue

    # Tamaño original en KB
    size_orig=$(du -k "$file" | cut -f1)

    # 🧠 Conversión a WebP SIN pérdida
    magick "$file" \
        -define webp:lossless=true \
        -define webp:method=6 \
        -strip \
        "$output" 2>/dev/null

    # Verificar que se creó correctamente
    if [ ! -f "$output" ]; then
        echo "⚠️ Error al convertir $file"
        continue
    fi

    # Tamaño nuevo en KB
    size_new=$(du -k "$output" | cut -f1)

    # Calcular porcentaje de reducción
    if [ "$size_orig" -gt 0 ]; then
        reduction=$((100 * (size_orig - size_new) / size_orig))
    else
        reduction=0
    fi

    # Mostrar resultados
    if [ "$size_new" -lt "$size_orig" ]; then
        echo -e "🖼️  $file → ${GREEN}${reduction}% reducción${NC}"
    else
        echo -e "🖼️  $file → ${RED}+${reduction#-}% incremento${NC}"
    fi

    echo "   ➜ Original: ${size_orig} KB"
    echo "   ➜ WebP nuevo: ${size_new} KB"

    # Eliminar original solo si WebP pesa menos
    if [ "$size_new" -lt "$size_orig" ]; then
        rm "$file"
        echo "   ❌ Archivo original eliminado."
    else
        rm "$output"
        echo "   ↩️  WebP descartado (no mejora tamaño)."
    fi

    echo "----------------------------------------"
done

echo "✅ Conversión WebP sin pérdida completada en '$BASE_DIR'."
