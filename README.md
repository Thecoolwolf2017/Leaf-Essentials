# Leaf Essentials

A Minecraft Bedrock behavior pack. This migration review uses the public v4.3 development tree at [`e5966ae`](https://github.com/TrashyDaFox/Leaf/tree/e5966ae14b7625f1fb38f19520fd4d7bf14b1d40). See the accompanying MIT notices in `LICENSE` and `LICENSE.v4.3`.

## Build checks

With Node.js and npm installed, run:

```sh
npm ci
npm run build
npm test
```

Rollup reads the tracked `scripts/startup.js` modules and writes `dist/startup.js`. It does not overwrite the pack's checked-in script entry. These checks verify compilation and syntax; they don't launch Minecraft or upload an add-on to a Realm. The separately distributed resource pack is not part of this migration tree.

## Make a behavior-only test add-on

After the build checks, run `python tools/package_behavior.py` (Python 3). It writes a test `.mcaddon` to `dist/` and verifies the nested behavior pack. It does not upload or release anything. Use GitHub Releases for downloadable assets after in-game testing with the matching resource pack.
