import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isWeb = Platform.OS === 'web';
export const isTablet = width >= 768;
export const isDesktop = width >= 1024;

export const getResponsiveValue = (mobile: number, tablet: number, desktop: number) => {
  if (isDesktop) return desktop;
  if (isTablet) return tablet;
  return mobile;
};

export const getSpacing = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  const spacings = {
    xs: getResponsiveValue(4, 6, 8),
    sm: getResponsiveValue(8, 12, 16),
    md: getResponsiveValue(16, 20, 24),
    lg: getResponsiveValue(24, 32, 40),
    xl: getResponsiveValue(32, 48, 64)
  };
  return spacings[size];
};

export const getFontSize = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl') => {
  const sizes = {
    xs: getResponsiveValue(12, 13, 14),
    sm: getResponsiveValue(14, 15, 16),
    md: getResponsiveValue(16, 17, 18),
    lg: getResponsiveValue(18, 20, 22),
    xl: getResponsiveValue(24, 28, 32),
    xxl: getResponsiveValue(32, 36, 42)
  };
  return sizes[size];
};