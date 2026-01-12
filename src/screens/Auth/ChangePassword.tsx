import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useForm } from '../../hooks/useForm';
import * as Yup from 'yup';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import GradientHeader from '../../components/common/Authheader';
import CustomHeader from '../../components/common/CustomHeader';
import FooterButtonGroup from '../../components/common/FooterHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, useTheme } from '../../context/ThemeContext';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';

// Validation for change password
const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old Password is required'),
  newPassword: Yup.string()
    .min(6, 'Minimum 6 characters')
    .required('New Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ChangePasswordScreen = ({ navigation }: { navigation: any }) => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    handleBlur,
    isSubmitting,
  } = useForm(
    {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    changePasswordSchema,
  );
  const { theme } = useTheme();
  const onSave = (formValues: any) => {
    // Save password change logic here
    Alert.alert('Password changed successfully!');
  };
  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: COLORS.background1,
    },
    headerTitle: {
      ...styles.headerTitle,
      color: theme === 'dark' ? '#ffffff' : '#000',
    },
  };
  return (
    <KeyboardAvoidingView
      style={themedStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* <CustomHeader variant={{
        type:'basic'
      }} /> */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Ionicons name="arrow-back-outline" size={26} color={theme === 'dark' ? '#ffffff' : '#000000'} /> */}
          {renderLogo(theme === 'dark' ? icons.ic_back : icons.ic_backb, {
            width: 19,
            height: 18,
          })}
        </TouchableOpacity>
        <Text style={themedStyles.headerTitle}>Change Password</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <CustomInput
          label="Old Password"
          value={values.oldPassword}
          onChangeText={text => handleChange('oldPassword', text)}
          onBlur={() => handleBlur('oldPassword')}
          placeholder="Enter Old Password"
          secureTextEntry
          error={errors.oldPassword}
          required
        />

        <CustomInput
          label="New Password"
          value={values.newPassword}
          onChangeText={text => handleChange('newPassword', text)}
          onBlur={() => handleBlur('newPassword')}
          placeholder="Enter New Password"
          secureTextEntry
          error={errors.newPassword}
          required
        />

        <CustomInput
          label="Confirm Password"
          value={values.confirmPassword}
          onChangeText={text => handleChange('confirmPassword', text)}
          onBlur={() => handleBlur('confirmPassword')}
          placeholder="Confirm New Password"
          secureTextEntry
          error={errors.confirmPassword}
          required
        />
      </ScrollView>
      <FooterButtonGroup
        onSave={() => handleSubmit(onSave)}
        onCancel={() => navigation.goBack()}
        isSubmitting={isSubmitting}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default ChangePasswordScreen;
