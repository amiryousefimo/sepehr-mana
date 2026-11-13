# Offline runtime dependencies

`vendor/` contains the eight Python packages pinned in `requirements.lock.txt`.
Their distribution metadata and original license files are retained. Native
extensions and bytecode are excluded; MarkupSafe uses its supplied Python fallback.
`production.py` loads this directory before importing the workbench.

No pip installation, virtual environment, extra system packages, or deployment
configuration changes are required. The existing host must provide Python 3.11+
with SQLite, as the website's original runtime already does.

Regenerate from the locked workbench environment using the root repository's
`sync_didban.py`. Never copy runtime data, credentials, or a developer environment
into this directory.
