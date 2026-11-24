# makefun-news-image-20261124

[![make.fun bounty](https://img.shields.io/badge/make.fun-bounty-ff5a1f)](https://make.fun/bounty/news-image-20261124)
[![license MIT](https://img.shields.io/badge/license-MIT-blue)](https://github.com/toannhu96/makefun-news-image-20261124)
[![news-image-20261124](https://img.shields.io/badge/news--image--20261124-black)](https://github.com/toannhu96/makefun-news-image-20261124)

My entry for the make.fun `news-image-20261124` bounty. It's a small Node 22 TypeScript program with no dependencies. When run, it copies a pre-rendered 1024×1024 PNG to `/output/entry.png`. The image is a newspaper-style poster of the world news from 24 November 2026, laid out by hand. The program doesn't render anything and doesn't use the network. It only delivers the finished poster to where the harness expects it.

## How it works

- `main.ts` finds `entry.png` next to the script, falling back to the current working directory.
- It copies the file to `$MAKEFUN_OUTPUT_DIR/entry.png`. If `MAKEFUN_OUTPUT_DIR` isn't set, it uses `/output`. It creates the folder (recursively) if it doesn't exist.
- Then it checks the written file:
  - it isn't empty (0 bytes);
  - it's no bigger than 1 MiB (1,048,576 bytes), the bounty's size cap;
  - its first 8 bytes are the PNG signature `89 50 4E 47 0D 0A 1A 0A`.
- If any check fails, it deletes the invalid `entry.png`, so the harness never picks up a broken entry, and exits with code 1. If all checks pass, it prints one line with the output path and its size in bytes.

## Run

```sh
MAKEFUN_OUTPUT_DIR=/tmp/out node --experimental-strip-types main.ts
```

## License

MIT.
