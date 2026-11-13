"""Loopback-only worker, reached through the site's scoped proxy."""
import json, os, sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent/'vendor'))
from werkzeug.middleware.proxy_fix import ProxyFix
from app import app, initialize
from waitress import serve

if __name__=='__main__':
    initialize()
    seed=os.environ.get('WORKBENCH_SEED_FILE')
    if seed:
        from provision_users import provision
        records=json.loads(Path(seed).read_text(encoding='utf-8'))
        passwords={r['username']:r['password'] for r in records}
        if set(passwords)!={'admin','test','monir.sadat'}:
            raise ValueError('Seed file must contain exactly the three requested accounts.')
        provision(passwords['monir.sadat'],passwords)
    app.config['ALLOWED_HOSTS']={x.strip() for x in os.environ.get('WORKBENCH_HOSTS','localhost,127.0.0.1,tgsepma.com,www.tgsepma.com').split(',')}
    app.wsgi_app=ProxyFix(app.wsgi_app,x_for=1,x_proto=1,x_host=1,x_prefix=1)
    serve(app,host='127.0.0.1',port=int(os.environ.get('WORKBENCH_PORT','8877')),threads=8,
          trusted_proxy='127.0.0.1',trusted_proxy_headers={'x-forwarded-for','x-forwarded-proto','x-forwarded-host'})
