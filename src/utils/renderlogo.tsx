import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';
import { SvgProps } from 'react-native-svg';

type LogoSource = ImageSourcePropType | React.FC<SvgProps>;

export function renderLogo(
  logoSource: LogoSource,
  logoStyle?: StyleProp<ImageStyle>,
  defaultSvgSize = { width: 200, height: 60 },
) {
  if (!logoSource) return null;

  // If it's a function → SVG
  if (typeof logoSource === 'function') {
    const SvgLogo = logoSource as React.FC<SvgProps>;
    return (
      <SvgLogo
        width={(logoStyle as any)?.width || defaultSvgSize.width}
        height={(logoStyle as any)?.height || defaultSvgSize.height}
        {...(logoStyle as any)}
      />
    );
  }

  // Otherwise → normal image
  return <Image source={logoSource} style={logoStyle} resizeMode="contain" />;
}
