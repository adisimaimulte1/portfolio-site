"""Build lightweight video posters so gallery scrolling never loads video streams.
Requires Pillow and imageio-ffmpeg: python -m pip install Pillow imageio-ffmpeg
"""
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
import hashlib
import json
import subprocess
import imageio_ffmpeg
from PIL import Image

root = Path(__file__).resolve().parents[1]
destination = root / 'assets/video-previews'
destination.mkdir(exist_ok=True)
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()


def generate(source):
    relative = source.relative_to(root).as_posix()
    stat = source.stat()
    # Avoid rereading gigabytes of unchanged videos on every build.
    key = hashlib.sha256(f'{relative}:{stat.st_size}:{stat.st_mtime_ns}:poster-v1'.encode()).hexdigest()[:20]
    cache = destination / f'{key}.json'
    if cache.exists():
        record = json.loads(cache.read_text(encoding='utf-8'))
        if all((root / v['src']).is_file() for v in record['variants']):
            return relative, record
    for timestamp in ('0.1', '0'):
        result = subprocess.run([
            ffmpeg, '-hide_banner', '-loglevel', 'error', '-threads', '1', '-ss', timestamp,
            '-i', str(source), '-map', '0:v:0', '-frames:v', '1', '-an', '-sn',
            '-vf', "scale=w='min(960,iw)':h='min(960,ih)':force_original_aspect_ratio=decrease,setsar=1",
            '-filter_threads', '1', '-threads', '1', '-f', 'image2pipe', '-c:v', 'png', 'pipe:1'
        ], capture_output=True, timeout=60)
        if result.returncode == 0 and result.stdout:
            break
    else:
        raise RuntimeError(f'{relative}: {result.stderr.decode(errors="replace")}')
    with Image.open(BytesIO(result.stdout)) as frame:
        frame = frame.convert('RGB')
        record = {'width': frame.width, 'height': frame.height, 'variants': []}
        for edge in sorted({min(n, max(frame.size)) for n in (320, 640, 960)}):
            image = frame.copy()
            image.thumbnail((edge, edge), Image.Resampling.LANCZOS)
            target = destination / f'{key}-{edge}.webp'
            image.save(target, 'WEBP', quality=78, method=6)
            record['variants'].append({'src': target.relative_to(root).as_posix(), 'width': image.width})
        record['src'] = record['variants'][0]['src']
    cache.write_text(json.dumps(record), encoding='utf-8')
    return relative, record


if __name__ == '__main__':
    sources = sorted(p for p in (root / 'assets/projects').glob('*/gallery/**/*')
                     if p.is_file() and not p.is_symlink() and p.suffix.lower() in {'.mp4', '.webm', '.ogv'})
    galleries = {p.name: {} for p in (root / 'assets/projects').iterdir() if p.is_dir()}
    with ThreadPoolExecutor(max_workers=2) as pool:
        for index, (source, record) in enumerate(pool.map(generate, sources), 1):
            galleries[Path(source).parts[2]][source] = record
            if index % 20 == 0:
                print(f'Prepared {index}/{len(sources)} video posters', flush=True)
    for folder, records in galleries.items():
        (destination / f'{folder}.json').write_text(json.dumps(records, separators=(',', ':')), encoding='utf-8')
    print(f'Indexed {len(sources)} video posters. Originals unchanged.')
