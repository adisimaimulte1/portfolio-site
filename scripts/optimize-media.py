"""Replace portfolio originals with bounded web media. Requires Pillow and imageio-ffmpeg.

Run before the preview/index generators. Originals are deliberately not retained.
Each output is decoded/validated before atomically replacing its input.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
import argparse
import json
import re
import subprocess
from PIL import Image, ImageCms, ImageOps
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.cache/media-optimization'
CACHE.mkdir(parents=True, exist_ok=True)
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

def image(source):
    target = source.with_suffix('.webp')
    if target != source and target.exists():
        raise RuntimeError(f'Output collision: {target}')
    with Image.open(source) as original:
        if original.format != 'MPO' and getattr(original, 'is_animated', False):
            raise RuntimeError(f'Animation needs separate handling: {source}')
        picture = ImageOps.exif_transpose(original)
        picture = picture.convert('RGBA' if 'A' in picture.getbands() or 'transparency' in picture.info else 'RGB')
        if original.info.get('icc_profile'):
            picture = ImageCms.profileToProfile(picture, ImageCms.ImageCmsProfile(BytesIO(original.info['icc_profile'])), ImageCms.createProfile('sRGB'), outputMode=picture.mode)
        picture.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
        picture.info.clear()
        temp = CACHE / (str(source.relative_to(ROOT)).replace('\\', '_').replace('/', '_') + '.webp')
        picture.save(temp, 'WEBP', quality=86 if source.suffix.lower() == '.png' or 'screenshot' in source.name.lower() else 82, method=6)
        with Image.open(temp) as check:
            check.load()
            assert check.size == picture.size
    before = source.stat().st_size
    temp.replace(target)
    if target != source:
        source.unlink()
    return source.relative_to(ROOT).as_posix(), target.relative_to(ROOT).as_posix(), before, target.stat().st_size

def video(source):
    relative = source.relative_to(ROOT).as_posix()
    marker = CACHE / (relative.replace('/', '_') + '.json')
    if marker.exists():
        record = json.loads(marker.read_text())
        if source.stat().st_size == record[3]: return record
    probe = subprocess.run([FFMPEG, '-hide_banner', '-i', str(source)], capture_output=True, text=True).stderr
    match = re.search(r'Duration: (\d+):(\d+):([\d.]+)', probe)
    if not match: raise RuntimeError(probe)
    h, m, s = map(float, match.groups())
    duration = h*3600+m*60+s
    # 22 MB per clip including audio; VBV bounds peaks without wasting bits on static scenes.
    rate = min(550, max(100, int(22_000_000*8/duration/1000)-52))
    temp = CACHE / (relative.replace('/', '_') + '.mp4')
    result = subprocess.run([FFMPEG, '-y', '-hide_banner', '-loglevel', 'error', '-i', str(source),
        '-map', '0:v:0', '-map', '0:a:0?', '-map_metadata', '-1', '-sn', '-dn',
        '-vf', "scale=w='min(960,iw)':h='min(960,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1,fps=24",
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '32', '-maxrate', f'{rate}k', '-bufsize', f'{rate*2}k',
        '-pix_fmt', 'yuv420p', '-threads', '2', '-c:a', 'aac', '-b:a', '48k', '-ac', '1', '-movflags', '+faststart', str(temp)], capture_output=True, text=True)
    if result.returncode: raise RuntimeError(relative+result.stderr)
    # Full decode catches corrupt packets/truncated encodes before removing the original.
    check = subprocess.run([FFMPEG, '-v', 'error', '-xerror', '-i', str(temp), '-f', 'null', '-'], capture_output=True)
    if check.returncode or check.stderr: raise RuntimeError(relative+str(check.stderr))
    before = source.stat().st_size
    if temp.stat().st_size < before:
        temp.replace(source)
    else:
        temp.unlink()
    record = [relative, relative, before, source.stat().st_size]
    marker.write_text(json.dumps(record))
    return record

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('kind', choices=['images', 'videos'])
    args = parser.parse_args()
    suffixes = {'.jpg', '.jpeg', '.png'} if args.kind == 'images' else {'.mp4'}
    sources = [p for p in (ROOT/'assets/projects').rglob('*') if p.is_file() and p.suffix.lower() in suffixes]
    records = []
    with ThreadPoolExecutor(max_workers=4 if args.kind == 'images' else 3) as pool:
        jobs = [pool.submit(image if args.kind == 'images' else video, p) for p in sources]
        for job in as_completed(jobs):
            records.append(job.result())
            (CACHE/f'{args.kind}.json').write_text(json.dumps(records, indent=2))
            print(f'{args.kind}: {len(records)}/{len(sources)}; {records[-1][2]/1e6:.1f} -> {records[-1][3]/1e6:.2f} MB', flush=True)
    if args.kind == 'images':
        for source in [*ROOT.glob('*.html'), *ROOT.joinpath('src').rglob('*.js'), *ROOT.joinpath('src').rglob('*.css')]:
            text = source.read_text(encoding='utf-8-sig')
            updated = text
            for old, new, _, _ in records:
                updated = updated.replace(old, new)
            if updated != text:
                source.write_text(updated, encoding='utf-8')
