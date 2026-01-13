// import React, { useEffect, useMemo, useRef, useCallback } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import {
//   BottomSheetModal,
//   BottomSheetScrollView,
//   BottomSheetBackdrop,
// } from '@gorhom/bottom-sheet';
// import { COLORS } from '../../constants/colors';
// import { FONTS } from '../../constants/fonts';
// import { useTheme } from '../../context/ThemeContext';

// export interface ActionItem {
//   id: string;
//   label: string;
//   icon?: React.ReactNode;
//   onPress: () => void;
// }

// export interface ActionSheetProps {
//   visible: boolean;
//   onClose: () => void;
//   title?: string;
//   items: ActionItem[];
// }

// const ActionSheet: React.FC<ActionSheetProps> = ({
//   visible,
//   onClose,
//   title,
//   items,
// }) => {
//   const { theme } = useTheme();
//   const modalRef = useRef<BottomSheetModal>(null);
//   const snapPoints = useMemo(() => ['40%', '70%'], []);

//   // Handle backdrop press
//   const renderBackdrop = useCallback(
//     (props: any) => (
//       <BottomSheetBackdrop
//         {...props}
//         disappearsOnIndex={-1}
//         appearsOnIndex={0}
//         onPress={onClose}
//       />
//     ),
//     [onClose],
//   );
//   const themedStyles = {
//     container: {
//       ...styles.container,
//       backgroundColor: theme === 'dark' ? '#000000' : COLORS.white, // Adjust based on theme
//     },
//     title: {
//       ...styles.title,
//       color: theme === 'dark' ? '#ffffff' : COLORS.gray, // Adjust based on theme
//     },
//     rowText: {
//       ...styles.rowText,
//       color: theme === 'dark' ? '#ffffff' : COLORS.dark,
//     },
//   };

//   useEffect(() => {
//     if (visible) {
//       // Small delay to ensure proper mounting
//       const timer = setTimeout(() => {
//         modalRef.current?.present();
//       }, 50);
//       return () => clearTimeout(timer);
//     } else {
//       modalRef.current?.dismiss();
//     }
//   }, [visible]);

//   const handleItemPress = useCallback((item: ActionItem) => {
//     // Close sheet first, then execute action after animation
//     modalRef.current?.dismiss();
//     setTimeout(() => {
//       item.onPress();
//     }, 200); // Increased delay to ensure sheet is fully closed
//   }, []);

//   const handleDismiss = useCallback(() => {
//     onClose();
//   }, [onClose]);

//   return (
//     <BottomSheetModal
//       ref={modalRef}
//       snapPoints={snapPoints}
//       enablePanDownToClose
//       onDismiss={handleDismiss}
//       handleIndicatorStyle={styles.handle}
//       backgroundStyle={styles.sheet}
//       backdropComponent={renderBackdrop}
//       // Add these props for better stability
//       enableDismissOnClose={true}
//       enableOverDrag={false}
//     >
//       <View style={themedStyles.container}>
//         {title ? <Text style={themedStyles.title}>{title}</Text> : null}
//         <BottomSheetScrollView
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {items.map(item => (
//             <View key={item.id}>
//               <TouchableOpacity
//                 style={styles.row}
//                 onPress={() => handleItemPress(item)}
//                 activeOpacity={0.7}
//               >
//                 {/* Safely render icon */}
//                 {item.icon ? (
//                   <View style={styles.rowIcon}>
//                     {React.isValidElement(item.icon) ? item.icon : null}
//                   </View>
//                 ) : (
//                   <View style={styles.rowIconPlaceholder} />
//                 )}
//                 <Text style={themedStyles.rowText}>{item.label}</Text>
//               </TouchableOpacity>
//               <View style={styles.separator} />
//             </View>
//           ))}
//           <View style={{ height: 8 }} />
//         </BottomSheetScrollView>
//       </View>
//     </BottomSheetModal>
//   );
// };
import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { FONTS } from '../../constants/fonts';
import { useTheme } from '../../context/ThemeContext';
import log from '../../utils/logger';
import colors from '../../constants/colors';

export interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

export interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  items: ActionItem[];
  children?: React.ReactNode;
}

const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  onClose,
  title,
  items,
  children,
}) => {
  const { theme } = useTheme();
  const modalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%', '70%'], []);
  const isVisibleRef = useRef(false);

  // Handle backdrop press
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={onClose}
      />
    ),
    [onClose],
  );

  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#000000' : colors.white,
    },
    title: {
      ...styles.title,
      color: theme === 'dark' ? '#ffffff' : colors.gray,
    },
    rowText: {
      ...styles.rowText,
      color: theme === 'dark' ? '#ffffff' : colors.dark,
    },
  };

  useEffect(() => {
    if (visible && !isVisibleRef.current) {
      isVisibleRef.current = true;
      // Increased delay to ensure proper mounting
      const timer = setTimeout(() => {
        try {
          modalRef.current?.present();
        } catch (error) {
          log.warn('Error presenting bottom sheet:', error);
          onClose(); // Fallback to close if presentation fails
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (!visible && isVisibleRef.current) {
      isVisibleRef.current = false;
      try {
        modalRef.current?.dismiss();
      } catch (error) {
        log.warn('Error dismissing bottom sheet:', error);
      }
    }
  }, [visible, onClose]);

  const handleItemPress = useCallback((item: ActionItem) => {
    try {
      // Close sheet first
      modalRef.current?.dismiss();
      isVisibleRef.current = false;

      // Execute action after animation with error handling
      setTimeout(() => {
        try {
          item.onPress();
        } catch (error) {
          log.error('Error executing action:', error);
        }
      }, 300);
    } catch (error) {
      log.error('Error handling item press:', error);
      // Fallback: execute action directly if sheet fails
      item.onPress();
    }
  }, []);

  const handleDismiss = useCallback(() => {
    isVisibleRef.current = false;
    onClose();
  }, [onClose]);

  // Don't render if not visible to prevent gesture conflicts
  if (!visible) {
    return null;
  }

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={handleDismiss}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.sheet}
      backdropComponent={renderBackdrop}
      enableDismissOnClose={true}
      enableOverDrag={false}
      // Add these props for better stability
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <View style={themedStyles.container}>
        {title ? <Text style={themedStyles.title}>{title}</Text> : null}
        <BottomSheetScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
          {!children &&
            items.map(item => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.7}
                >
                  {/* Safely render icon */}
                  {item.icon ? (
                    <View style={styles.rowIcon}>
                      {React.isValidElement(item.icon) ? item.icon : null}
                    </View>
                  ) : (
                    <View style={styles.rowIconPlaceholder} />
                  )}
                  <Text style={themedStyles.rowText}>{item.label}</Text>
                </TouchableOpacity>
                <View style={styles.separator} />
              </View>
            ))}
          <View style={{ height: 8 }} />
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.white, // Changed from colors.gray to white
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    backgroundColor: colors.lightGray,
    width: 40,
    height: 4,
  },
  container: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    fontSize: FONTS.sm,
    color: colors.gray,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  rowIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIconPlaceholder: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  rowText: {
    fontSize: FONTS.base,
    color: colors.dark,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginHorizontal: 16,
    opacity: 0.5,
  },
});

export default ActionSheet;
