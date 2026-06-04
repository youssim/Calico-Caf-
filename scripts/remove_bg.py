#!/usr/bin/env python3
"""Détoure le fond quasi-blanc des images de gobelets.

Stratégie : on calcule un masque des pixels "quasi-blancs", puis on ne rend
transparents que les composantes connexes qui TOUCHENT un bord de l'image
(= le fond). Les blancs intérieurs (couvercle, dessin du chien) ne touchent
pas les bords -> ils sont préservés.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

# Seuil : un pixel est "quasi-blanc" si ses 3 canaux sont >= WHITE_MIN
WHITE_MIN = 232

def process(path):
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    rgb = arr[:, :, :3].astype(np.int16)

    # Masque des pixels quasi-blancs
    near_white = np.all(rgb >= WHITE_MIN, axis=2)

    # Composantes connexes (8-connectivité) du masque quasi-blanc
    structure = np.ones((3, 3), dtype=int)
    labels, n = ndimage.label(near_white, structure=structure)

    # Quelles composantes touchent un bord ?
    border_labels = set()
    border_labels.update(np.unique(labels[0, :]))
    border_labels.update(np.unique(labels[-1, :]))
    border_labels.update(np.unique(labels[:, 0]))
    border_labels.update(np.unique(labels[:, -1]))
    border_labels.discard(0)  # 0 = pas quasi-blanc

    # Masque du fond = pixels appartenant à une composante touchant un bord
    bg = np.isin(labels, list(border_labels))

    # Rendre le fond transparent
    arr[bg, 3] = 0

    # Nettoyer les petits îlots opaques parasites (artefacts/specks) :
    # on garde uniquement les composantes opaques suffisamment grandes.
    opaque = arr[:, :, 3] > 0
    olabels, on = ndimage.label(opaque, structure=structure)
    sizes = ndimage.sum(np.ones_like(olabels), olabels, index=np.arange(1, on + 1))
    MIN_KEEP = 1500  # pixels
    small = {i + 1 for i, s in enumerate(sizes) if s < MIN_KEEP}
    if small:
        speck = np.isin(olabels, list(small))
        arr[speck, 3] = 0
        print(f"  -> {len(small)} petit(s) îlot(s) supprimé(s)")

    out = Image.fromarray(arr)
    out.save(path)
    removed = bg.sum()
    total = bg.size
    print(f"{path}: {n} composantes, fond retiré = {removed/total*100:.1f}% des pixels")

if __name__ == "__main__":
    for p in sys.argv[1:]:
        process(p)
