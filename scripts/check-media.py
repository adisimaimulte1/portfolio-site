"""Validate local asset references and enforce a lightweight production media budget."""
from pathlib import Path
import json
import re
import subprocess
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
errors = []
checked = set()
def check(value, source):
    value = unquote(value.split('?')[0].split('#')[0])
    if value.startswith('assets/') and '${' not in value and value not in checked:
        checked.add(value)
        if not (ROOT/value).exists(): errors.append(f'Missing {value} in {source}')

for p in [*ROOT.glob('*.html'), *ROOT.joinpath('src').rglob('*.js'), *ROOT.joinpath('src').rglob('*.css')]:
    text = p.read_text(encoding='utf-8-sig')
    for value in re.findall(r'["\x27`](assets/[^"\x27`\n]+)["\x27`]', text):
        check(value, p.relative_to(ROOT))
for folder in ('previews', 'video-previews'):
    for p in (ROOT/'assets'/folder).glob('*.json'):
        def walk(value):
            if isinstance(value, str): check(value, p.name)
            elif isinstance(value, list):
                for item in value: walk(item)
            elif isinstance(value, dict):
                for key, item in value.items():
                    check(key, p.name)
                    walk(item)
        walk(json.loads(p.read_text(encoding='utf-8-sig')))
files = [p for p in (ROOT/'assets').rglob('*') if p.is_file()]
total = sum(p.stat().st_size for p in files)
for p in files:
    size = p.stat().st_size
    limit = 50*1024**2
    if p.suffix.lower() in {'.mp4', '.webm', '.ogv', '.mov'}: limit = 25*1024**2
    if p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp', '.avif'}: limit = 1024**2
    if size > limit: errors.append(f'Asset exceeds {limit/1024**2:g} MiB budget: {p.relative_to(ROOT)} ({size/1024**2:.2f} MiB)')
if total > 750*1024**2: errors.append(f'Assets exceed 750 MiB budget: {total/1024**2:.1f} MiB')
if '--history' in sys.argv:
    objects = subprocess.check_output(['git', 'rev-list', '--objects', '--all'], cwd=ROOT)
    result = subprocess.check_output(['git', 'cat-file', '--batch-check=%(objecttype) %(objectsize) %(rest)'], input=objects, cwd=ROOT).decode()
    blobs = [line.split(' ', 2) for line in result.splitlines() if line.startswith('blob ')]
    for _, size, path in blobs:
        if int(size) >= 100*1024**2: errors.append(f'Historical blob exceeds GitHub limit: {path} ({size} bytes)')
    history_bytes = sum(int(size) for _, size, _ in blobs)
    if history_bytes > 950*1024**2: errors.append(f'Uncompressed history exceeds 950 MiB: {history_bytes/1024**2:.1f}')
    print(f'All-ref unique blob content: {history_bytes/1e6:.2f} MB')
print(f'Checked {len(checked)} asset references; assets {total/1e6:.2f} MB')
if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print('Media checks passed')
