import { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import { renderLogo } from '../utils/renderlogo';
import icons from './icons';

export interface BottomActionBarItem {
  id: string;
  icon: ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export const getBottomActionBarItems = (
  hasSelection: boolean,
  onNew: () => void,
  onEdit: () => void,
  onDelete: () => void,
  onRefresh: () => void,
  onExport: () => void,
  onMore: () => void,
): BottomActionBarItem[] => {
  const { theme } = useTheme();
  if (hasSelection) {
    return [
      {
        id: 'edit',
        icon: renderLogo(icons.ic_Edit, { width: 18, height: 18 }),
        label: 'Edit',
        onPress: onEdit,
      },
      {
        id: 'delete',
        icon: renderLogo(icons.ic_delete1, { width: 18, height: 18 }),
        label: 'Delete',
        onPress: onDelete,
      },
      {
        id: 'refresh',
        icon: renderLogo(icons.ic_Refresh, { width: 18, height: 18 }),
        label: 'Refresh',
        onPress: onRefresh,
      },
      {
        id: 'export',
        icon: renderLogo(icons.ic_Export_to_Excel, { width: 18, height: 18 }),
        label: 'Exp to excel',
        onPress: onExport,
      },
      {
        id: 'more',
        icon: renderLogo(icons.ic_dots, { width: 18, height: 18 }),
        label: 'More',
        onPress: onMore,
      },
    ];
  }

  return [
    {
      id: 'new',
      icon: renderLogo(theme === 'dark' ? icons.ic_Newd : icons.ic_Newb, {
        width: 18,
        height: 18,
      }),
      label: 'New',
      onPress: onNew,
    },
    {
      id: 'delete',
      icon: renderLogo(icons.ic_delete1, { width: 18, height: 18 }),
      label: 'Delete',
      onPress: onDelete,
      disabled: true,
    },
    {
      id: 'refresh',
      icon: renderLogo(
        theme === 'dark' ? icons.ic_Refreshd : icons.ic_Refresh,
        { width: 18, height: 18 },
      ),
      label: 'Refresh',
      onPress: onRefresh,
    },
    {
      id: 'export',
      icon: renderLogo(icons.ic_Export_to_Excel, { width: 18, height: 18 }),
      label: 'Exp to excel',
      onPress: onExport,
    },
    {
      id: 'more',
      icon: renderLogo(theme === 'dark' ? icons.icons : icons.ic_dots, {
        width: 18,
        height: 18,
      }),
      label: 'More',
      onPress: onMore,
    },
  ];
};
