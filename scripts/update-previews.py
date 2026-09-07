"""Generate cached responsive images without changing originals. Requires Pillow >= 11.3."""
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
import argparse
import hashlib
import json
import re
from PIL import Image, ImageCms, ImageOps, features

root = Path(__file__).resolve().parents[1]
destination = root / 'assets/previews'
destination.mkdir(exist_ok=True)
edges = (320, 640, 960)
version = b'responsive-v3-webp-production'


def generate(source):
    relative = source.relative_to(root).as_posix()
    graphics = source.suffix.lower() == '.png' or 'screenshot' in source.name.lower()
    fingerprint = hashlib.sha256(source.read_bytes() + version + (b'graphics' if graphics else b'')).hexdigest()[:20]
    cache = destination / f'{fingerprint}.json'
    if cache.exists():
        record = json.loads(cache.read_text(encoding='utf-8'))
        if all((root / v['src']).exists() for key in ('variants', 'avif') for v in record.get(key, [])):
            return relative, record
    with Image.open(source) as original:
        # MPO camera JPEGs have auxiliary frames, not a timed animation.
        if original.format != 'MPO' and getattr(original, 'is_animated', False):
            return relative, None
        picture = ImageOps.exif_transpose(original)
        picture = picture.convert('RGBA' if 'A' in picture.getbands() or 'transparency' in picture.info else 'RGB')
        profile = original.info.get('icc_profile')
        if profile:
            picture = ImageCms.profileToProfile(picture, ImageCms.ImageCmsProfile(BytesIO(profile)),
                                               ImageCms.createProfile('sRGB'), outputMode=picture.mode)
        picture.info.clear()
        width, height = picture.size
        # Use higher quality for small text and hard edges in screenshots/artwork.
        record = {'width': width, 'height': height, 'variants': [], 'avif': []}
        for edge in sorted({min(edge, max(width, height)) for edge in edges}):
            resized = picture.copy()
            resized.thumbnail((edge, edge), Image.Resampling.LANCZOS)
            for codec in ('webp',):
                target = destination / f'{fingerprint}-{edge}.{codec}'
                if not target.exists():
                    options = ({'quality': 86 if graphics else 78, 'method': 6} if codec == 'webp'
                               else {'quality': 75 if graphics else 65, 'speed': 6, 'max_threads': 1,
                                     'subsampling': '4:4:4' if graphics else '4:2:0'})
                    resized.save(target, codec.upper(), **options)
                record['variants' if codec == 'webp' else 'avif'].append({
                    'src': target.relative_to(root).as_posix(), 'width': resized.width,
                    'bytes': target.stat().st_size})
        # Reuse the production image at larger sizes without a duplicate encoding.
        if source.suffix.lower() == '.webp' and max(width, height) > max(edges):
            record['variants'].append({'src': relative, 'width': width, 'bytes': source.stat().st_size})
        # Advertise AVIF only when its set is smaller than the WebP set.
        if not record['avif'] or sum(v['bytes'] for v in record['avif']) >= sum(v['bytes'] for v in record['variants']):
            del record['avif']
        desired_width = width * min(960 / max(width, height), 1)
        record['src'] = min(record['variants'], key=lambda v: abs(v['width'] - desired_width))['src']
    cache.write_text(json.dumps(record), encoding='utf-8')
    return relative, record


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--prune', action='store_true', help='Remove obsolete generated encodings and their caches')
    args = parser.parse_args()
    sources = sorted(p for p in (root / 'assets/projects').rglob('*')
                     if p.is_file() and not p.is_symlink() and p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp', '.avif'})
    previews = {}
    with ThreadPoolExecutor(max_workers=4) as pool:
        for index, (relative, record) in enumerate(pool.map(generate, sources), 1):
            if record:
                previews[relative] = record
            if index % 25 == 0:
                print(f'Processed {index}/{len(sources)} images', flush=True)
    # Each gallery downloads only its own metadata. Project cards keep a tiny manifest.
    galleries = {folder.name: {} for folder in (root / 'assets/projects').iterdir()
                 if folder.is_dir() and not folder.is_symlink()}
    cards = {}
    for path, record in previews.items():
        folder = Path(path).parts[2]
        public = {key: value for key, value in record.items() if key not in ('variants', 'avif')}
        for key in ('variants', 'avif'):
            if key in record:
                public[key] = [{k: v for k, v in variant.items() if k != 'bytes'} for variant in record[key]]
        galleries.setdefault(folder, {})[path] = public
        if '/gallery/' not in path:
            cards[path] = {key: record[key] for key in ('src', 'width', 'height')}
    for folder, records in galleries.items():
        (destination / f'{folder}.json').write_text(json.dumps(records, separators=(',', ':')), encoding='utf-8')
    (root / 'src/scripts/data/previews.js').write_text(
        '// Generated by scripts/update-previews.py.\nexport const PREVIEWS = '
        + json.dumps(cards, separators=(',', ':')) + ';\n', encoding='utf-8')
    if args.prune:
        keep = set()
        for record in previews.values():
            for key in ('variants', 'avif'):
                for variant in record.get(key, []):
                    name = Path(variant['src']).name
                    keep.update((name, name.split('-')[0] + '.json'))
        removed_bytes = 0
        for file in destination.iterdir():
            if (file.is_file() and not file.is_symlink() and file.parent.resolve() == destination.resolve()
                    and re.fullmatch(r'[0-9a-f]{20}(?:-\d+)?\.(?:webp|avif|json)', file.name)
                    and file.name not in keep):
                removed_bytes += file.stat().st_size
                file.unlink()
        print(f'Removed {removed_bytes / 1e6:.1f} MB of obsolete generated files')
    original_bytes = sum((root / p).stat().st_size for p in previews)
    small_bytes = sum((p.get('avif') or p['variants'])[0]['bytes'] for p in previews.values())
    print(f'{len(previews)} images: originals {original_bytes / 1e6:.1f} MB; smallest previews {small_bytes / 1e6:.1f} MB')
