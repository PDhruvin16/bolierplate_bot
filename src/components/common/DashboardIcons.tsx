import icons from '../../constants/icons';
import { renderLogo } from '../../utils/renderlogo';
import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

export const PeopleIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => renderLogo(icons.searching1, { width: 16, height: 16 });

export const BriefcaseIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => renderLogo(icons.ic_bagcase, { width: 16, height: 16 });

export const DocumentIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => renderLogo(icons.ic_Escalated, { width: 16, height: 16 });

export const CancelledIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => renderLogo(icons.ic_cancledcase, { width: 16, height: 16 });

export const CheckmarkIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => renderLogo(icons.ic_Resolvedcase, { width: 16, height: 16 });

export const StarIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => renderLogo(icons.ic_feedback, { width: 16, height: 16 });

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
