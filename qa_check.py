from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent
HTML_FILES = [ROOT / 'index.html', ROOT / 'mock6.html', ROOT / 'mock9.html']

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        for key in ('href','src'):
            if key in attrs:
                self.refs.append((tag,key,attrs[key]))

missing=[]
for html_file in HTML_FILES:
    parser=LinkParser()
    parser.feed(html_file.read_text(encoding='utf-8', errors='ignore'))
    for tag,key,ref in parser.refs:
        if not ref or ref.startswith(('http://','https://','mailto:','tel:','data:','#')):
            continue
        local=ref.split('#')[0].split('?')[0]
        if not local:
            continue
        target=(html_file.parent/local).resolve()
        if not target.exists():
            missing.append((html_file.name, ref))

print('HTML files:', ', '.join(p.name for p in HTML_FILES))
print('Missing local references:', len(missing))
for item in missing:
    print(' -', item[0], '=>', item[1])

if missing:
    raise SystemExit(1)
print('QA OK: local references exist.')
