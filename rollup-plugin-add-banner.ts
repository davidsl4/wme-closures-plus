import MagicString from 'magic-string';
import { Plugin } from 'rollup';
import { readFileSync } from 'fs';

type FileBannerOptions = {
  file: string;
};
type InlineBannerOptions = {
  banner: string;
};

type AnyBannerOptions = FileBannerOptions | InlineBannerOptions;

function getBannerFromOptions(options: AnyBannerOptions): string {
  if ('banner' in options) return options.banner;

  return readFileSync(options.file).toString();
}

export default function addBanner(options: AnyBannerOptions): Plugin {
  const banner = getBannerFromOptions(options).trim() + '\n';

  return {
    name: 'add-banner',
    renderChunk(code: string) {
      const magicString = new MagicString(code);
      magicString.prepend(`${banner}\n`);

      return {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true }),
      };
    },
  };
}
