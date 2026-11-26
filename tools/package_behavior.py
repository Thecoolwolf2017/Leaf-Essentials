"""Package the compiled Leaf behavior pack without changing tracked files."""
import io
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "dist" / "startup.js"
OUTPUT = ROOT / "dist" / "Leaf-Essentials-v4.3-behavior-test.mcaddon"
PACK_NAME = "Leaf-Essentials-Behavior.mcpack"
ASSETS = ("animation_controllers", "animations", "blocks", "entities", "item_catalog", "items", "scripts", "subpacks")

def write(archive, name, payload):
    entry = ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
    entry.create_system = 3
    entry.external_attr = 0o100644 << 16
    archive.writestr(entry, payload, compress_type=ZIP_DEFLATED, compresslevel=9)

def main():
    if not BUNDLE.is_file():
        raise SystemExit("Compile the startup bundle first with npm run build.")
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    script_entries = [m["entry"] for m in manifest["modules"] if m["type"] == "script"]
    if script_entries != ["scripts/startup.js"]:
        raise SystemExit("Manifest startup no longer matches the packaging configuration.")
    files = {"manifest.json": ROOT / "manifest.json", "pack_icon.png": ROOT / "pack_icon.png",
             "LICENSE": ROOT / "LICENSE.v4.3"}
    for directory in ASSETS:
        for path in (ROOT / directory).rglob("*"):
            if path.is_file() and not path.is_symlink():
                files[path.relative_to(ROOT).as_posix()] = path
    files[script_entries[0]] = BUNDLE
    pack = io.BytesIO()
    with ZipFile(pack, "w") as archive:
        for name, path in sorted(files.items()):
            write(archive, name, path.read_bytes())
    with ZipFile(OUTPUT, "w") as addon:
        write(addon, PACK_NAME, pack.getvalue())
    with ZipFile(OUTPUT) as addon:
        if addon.testzip() is not None:
            raise RuntimeError("Add-on archive failed integrity validation")
        with ZipFile(io.BytesIO(addon.read(PACK_NAME))) as behavior:
            if behavior.testzip() is not None or behavior.read(script_entries[0]) != BUNDLE.read_bytes():
                raise RuntimeError("Behavior archive failed integrity or entry validation")
    print(OUTPUT)

if __name__ == "__main__":
    main()
