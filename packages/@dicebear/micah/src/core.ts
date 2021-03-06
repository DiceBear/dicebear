import type { Style } from '@dicebear/avatars';
import { utils } from '@dicebear/avatars';
import type { Options } from './options';
import * as paths from './paths';
import * as colors from './colors';
import { schema } from './schema';

export const style: Style<Options> = {
  meta: {
    title: 'Avatar Illustration System',
    creator: 'Micah Lanier',
    contributor: 'Florian Körner',
    source: 'https://www.figma.com/community/file/829741575478342595',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    const pickColor = (values: string[], filter: string[] = []): string => {
      let result: string[] = values.map((val) => colors[val as keyof typeof colors] || val);

      // If only one color was given, that color was explicitly selected. Then do not perform any filtering.
      if (values.length > 1) {
        result = result.filter((val) => false === filter.includes(val));
      }

      if (result.length === 0) {
        result.push('transparent');
      }

      return prng.pick(result);
    };

    const pickPath = <T extends {}, K extends keyof T>(
      paths: T,
      values: K[] = []
    ): { path: T[K] | undefined; key: K } => {
      const key = prng.pick(values);

      return {
        path: paths[key],
        key,
      };
    };

    const baseColor = pickColor(options.baseColor ?? []);
    const hairColor = pickColor(options.hairColor ?? [], [baseColor]);
    const shirtColor = pickColor(options.shirtColor ?? [], [baseColor]);
    const earringColor = pickColor(options.earringColor ?? [], [baseColor, hairColor]);
    const glassesColor = pickColor(options.glassesColor ?? [], [baseColor, hairColor]);
    const eyeShadowColor = pickColor(options.eyeShadowColor ?? [], [baseColor, glassesColor]);
    const eyebrowColor = pickColor(options.eyebrowColor ?? [], [baseColor, glassesColor, eyeShadowColor]);
    const facialHairColor = pickColor(options.facialHairColor ?? [], [baseColor]);

    const { path: earringsPath } = pickPath(paths.earrings, options.earrings);
    const { path: glassesPath } = pickPath(paths.glasses, options.glasses);
    const { path: hairPath } = pickPath(paths.hair, options.hair);
    const { path: facialHairPath, key: facialHairPathKey } = pickPath(paths.facialHair, options.facialHair);

    const shirt = pickPath(paths.shirt, options.shirt).path;
    const earrings = prng.bool(options.earringsProbability) && earringsPath;
    const ears = pickPath(paths.ears, options.ears).path;
    const nose = pickPath(paths.nose, options.nose).path;
    const glasses = prng.bool(options.glassesProbability) && glassesPath;
    const eyes = pickPath(paths.eyes, options.eyes).path;
    const eyebrows = pickPath(paths.eyebrows, options.eyebrows).path;
    const mouth = pickPath(paths.mouth, options.mouth).path;
    const hair = prng.bool(options.hairProbability) && hairPath;
    const facialHair = prng.bool(options.facialHairProbability) && facialHairPath;
    const base = pickPath(paths.base, options.base).path;

    const isBlackFacialHairColor = facialHairColor.match(/^#0+$/);
    const mouthColor = facialHair && facialHairPathKey === 'beard' && isBlackFacialHairColor ? '#434343' : '#000';

    return {
      attributes: {
        viewBox: '0 0 360 360',
        fill: 'none',
      },
      body: `
        ${base ? utils.svg.createGroup({ children: base(baseColor), x: 90, y: 43 }) : ''}
        ${facialHair ? utils.svg.createGroup({ children: facialHair(facialHairColor), x: 124, y: 145.3 }) : ''}
        ${mouth ? utils.svg.createGroup({ children: mouth(mouthColor), x: 180, y: 203 }) : ''}
        ${eyebrows ? utils.svg.createGroup({ children: eyebrows(eyebrowColor), x: 120, y: 122 }) : ''}
        ${hair ? utils.svg.createGroup({ children: hair(hairColor), x: 59, y: 31 }) : ''}
        ${eyes ? utils.svg.createGroup({ children: eyes(eyeShadowColor), x: 152, y: 139 }) : ''}
        ${glasses ? utils.svg.createGroup({ children: glasses(glassesColor), x: 112, y: 131 }) : ''}
        ${nose ? utils.svg.createGroup({ children: nose('#000'), x: 186.37, y: 168.42 }) : ''}
        ${ears ? utils.svg.createGroup({ children: ears(baseColor), x: 94, y: 174 }) : ''}
        ${earrings ? utils.svg.createGroup({ children: earrings(earringColor), x: 97, y: 209 }) : ''}
        ${shirt ? utils.svg.createGroup({ children: shirt(shirtColor), x: 63, y: 292 }) : ''}
      `,
    };
  },
};
