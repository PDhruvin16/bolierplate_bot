# Common Components

This directory contains reusable UI components that can be used throughout the CRM Mobile app.

## Components

### 1. CommonPopup

A versatile modal popup component with different variants for various use cases.

#### Features:
- Multiple variants: `delete`, `warning`, `template`, `settings`
- Configurable input fields and toggle switches
- Customizable buttons and actions
- Responsive design with drag handle and home indicator

#### Usage:

```tsx
import { CommonPopup, PopupField, PopupToggle } from '../components/common';

// Delete confirmation popup
<CommonPopup
  visible={deleteVisible}
  onClose={() => setDeleteVisible(false)}
  title="Delete"
  message="Do you want to delete this? You can't undo, but you can request an admin attempt to recover if needed."
  primaryButtonText="Apply"
  secondaryButtonText="Cancel"
  onPrimaryPress={handleDelete}
  variant="delete"
/>

// Template popup with input fields
const fields: PopupField[] = [
  {
    label: 'Choose Template',
    placeholder: '---',
    value: templateValue,
    onChangeText: setTemplateValue,
    type: 'search',
  },
];

<CommonPopup
  visible={templateVisible}
  onClose={() => setTemplateVisible(false)}
  title="Title"
  fields={fields}
  primaryButtonText="Apply"
  secondaryButtonText="Cancel"
  onPrimaryPress={handleTemplate}
  variant="template"
/>

// Settings popup with toggles
const toggles: PopupToggle[] = [
  {
    label: 'Allow Pause and Resume',
    value: allowPause,
    onValueChange: setAllowPause,
  },
];

<CommonPopup
  visible={settingsVisible}
  onClose={() => setSettingsVisible(false)}
  title="Title"
  toggles={toggles}
  variant="settings"
  showButtons={false}
/>
```

### 2. CustomButton

Enhanced button component with multiple variants and states.

#### Features:
- Multiple variants: `primary`, `secondary`, `outline`, `gray`, `light`
- Different sizes: `small`, `medium`, `large`
- Loading and disabled states
- Optional icons with plus signs
- Gradient support for primary variant

#### Usage:

```tsx
import { CustomButton } from '../components/common';

// Primary button with gradient
<CustomButton
  title="Button"
  onPress={handlePress}
  variant="primary"
  size="medium"
  icon={true}
/>

// Secondary button
<CustomButton
  title="Button"
  onPress={handlePress}
  variant="outline"
  size="medium"
/>

// Disabled button
<CustomButton
  title="Button"
  onPress={handlePress}
  variant="light"
  disabled={true}
/>
```

### 3. SLATimerWidget

A widget component for displaying SLA (Service Level Agreement) timer information.

#### Features:
- Circular progress indicators
- First Response and Resolution KPI tracking
- Refresh functionality
- Real-time updates
- Customizable styling

#### Usage:

```tsx
import { SLATimerWidget, SLATimerData } from '../components/common';

const slaData: SLATimerData = {
  firstResponseTime: '12:34 min',
  resolutionTime: '24:20 min',
  firstResponseProgress: 65,
  resolutionProgress: 40,
  lastUpdated: '19 June 12:30 PM',
};

<SLATimerWidget
  data={slaData}
  onRefresh={handleRefresh}
/>
```

## Styling

All components use the app's design system:
- Colors from `src/constants/colors.ts`
- Fonts from `src/constants/fonts.ts`
- Consistent spacing and border radius
- Shadow and elevation effects

## TypeScript Support

All components are fully typed with TypeScript interfaces:
- `CommonPopupProps` for popup configuration
- `ButtonProps` for button customization
- `SLATimerWidgetProps` for timer widget setup

## Demo

See `src/screens/Demo/ComponentDemoScreen.tsx` for a complete example of all components in action.
