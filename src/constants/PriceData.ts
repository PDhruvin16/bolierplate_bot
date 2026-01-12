import { useTheme } from '../context/ThemeContext';
import { renderLogo } from '../utils/renderlogo';
import icons from './icons';
import { ReactNode } from 'react';
export interface PriceItem {
  id: string;
  name: string;
  phone: string;
  city: string;
  email: string;
  status: { value: string; label: string };

  selected?: boolean;
  icon?: string;
}

export const PRICE_DATA: PriceItem[] = [
  {
    id: '1',
    name: 'Fabrikam Technologies',
    phone: '+1 (555) 123-4567',
    city: 'Seattle, WA',
    email: 'contact@fabrikam.com',
    status: { value: 'Active', label: 'Active' },
  },
  {
    id: '2',
    name: 'Blue Yonder Airlines',
    phone: '+1 (555) 234-5678',
    city: 'Denver, CO',
    email: 'info@blueyonder.com',
    status: { value: 'Active', label: 'Active' },
  },
  {
    id: '3',
    name: 'Contoso Pharmaceuticals',
    phone: '+1 (555) 345-6789',
    city: 'Boston, MA',
    email: 'support@contoso.com',
    status: { value: 'Active', label: 'Active' },
  },
  {
    id: '4',
    name: 'Fourth Coffee',
    phone: '+1 (555) 456-7890',
    city: 'Portland, OR',
    email: 'orders@fourthcoffee.com',
    status: { value: 'Active', label: 'Active' },
  },
  {
    id: '5',
    name: 'Graphic Design Institute',
    phone: '+1 (555) 567-8901',
    city: 'San Francisco, CA',
    email: 'admissions@gdi.com',
    status: { value: 'Active', label: 'Active' },
  },
  {
    id: '6',
    name: 'Litware Inc.',
    phone: '+1 (555) 678-9012',
    city: 'Austin, TX',
    email: 'contact@litware.com',
    status: { value: 'Active', label: 'Active' },
  },
  {
    id: '7',
    name: 'Adventure Works',
    phone: '+1 (555) 789-0123',
    city: 'Miami, FL',
    email: 'sales@adventureworks.com',
    status: { value: 'Active', label: 'Active' },
  },
  {
    id: '8',
    name: 'Proseware',
    phone: '+1 (555) 890-1234',
    city: 'Chicago, IL',
    email: 'info@proseware.com',
    status: { value: 'Active', label: 'Active' },
  },
];



export interface ActionBarItem {
  id: string;
  icon: ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export const getActionBarItems = (
  hasSelection: boolean,
  onNew: () => void,
  onEdit: () => void,
  onDelete: () => void,
  onRefresh: () => void,
  onExport: () => void,
  onMore: () => void,
): ActionBarItem[] => {
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
