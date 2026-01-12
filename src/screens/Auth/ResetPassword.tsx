import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../context/AuthContext';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import Loader from '../../components/common/Loader';
import GradientHeader from '../../components/common/Authheader';
import images from '../../constants/images';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

type ResetPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ResetPassword'
>;

const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const { resetPassword, isLoading } = useAuth() as any;
  const { theme } = useTheme();
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm<{
    newPassword: string;
    confirmPassword: string;
  }>({
    newPassword: '',
    confirmPassword: '',
  });
  const themedestyle = {
    contentContainer: {
      ...styles.contentContainer,
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
    },
    headerSubtitle: {
      ...styles.headerSubtitle,
      color: theme === 'dark' ? '#CCCCCC' : '#6C757D',
    },
    headerTitle: {
      ...styles.headerTitle,
      color: theme === 'dark' ? '#FFFFFF' : '#000',
    },
  };
  const handleSave = async (formValues: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (formValues.newPassword !== formValues.confirmPassword) {
      Alert.alert('Error', 'Both passwords must match');
      return;
    }

    try {
      await resetPassword({ password: formValues.newPassword });
      Alert.alert('Success', 'Password reset successfully');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to reset password');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Loader visible={isLoading} text="Saving..." />

      {/* Gradient Header */}
      <View>
        <GradientHeader
          logoSource={images.AppLogo}
          logoStyle={{
            width: 200,
            height: 100,
            marginBottom: 20,
          }}
        />
        <View
          style={{
            ...StyleSheet.absoluteFillObject, // makes it fill its parent
            backgroundColor: theme === 'dark' ? '#111111' : '#FFFFFF99',

            borderRadius: 150,
            top: 230,
            bottom: 0,
            height: 60,
            width: '90%',
            left: '5%',
            opacity: theme === 'dark' ? 0.3 : 1,
          }}
        />
      </View>

      {/* White Card */}
      <ScrollView
        style={themedestyle.contentContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.headerContent}>
          <Text style={themedestyle.headerTitle}>Reset Your Password</Text>
          <Text style={themedestyle.headerSubtitle}>
            Your new password must be different from previous used password
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* New Password */}
          <View style={styles.inputContainer}>
            {/* <Text style={styles.inputLabel}>New Password*</Text> */}
            <CustomInput
              label="New Password"
              value={values.newPassword}
              onChangeText={text => handleChange('newPassword', text)}
              placeholder="Enter new password"
              secureTextEntry
              error={errors.newPassword}
              required
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            {/* <Text style={styles.inputLabel}>Confirm Password*</Text> */}
            <CustomInput
              label="Confirm Password"
              value={values.confirmPassword}
              onChangeText={text => handleChange('confirmPassword', text)}
              placeholder="Confirm password"
              secureTextEntry
              error={errors.confirmPassword}
              required
            />
          </View>

          {/* Match Text */}
          {/* <Text style={styles.matchText}>Both password must match</Text> */}
          <TouchableOpacity
            //   style={{ alignSelf: 'center', marginTop: 12 }}
            onPress={() => navigation.navigate('Login')}
          >
            <MaskedView
              maskElement={
                <Text
                  style={[
                    styles.gradientText,
                    { backgroundColor: 'transparent' },
                  ]}
                >
                  Both password must match
                </Text>
              }
            >
              <LinearGradient
                colors={['#404698', '#882785']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.gradientText, { opacity: 0 }]}>
                  Both password must match
                </Text>
              </LinearGradient>
            </MaskedView>
          </TouchableOpacity>
          {/* Save Button */}
          <CustomButton
            title="Save"
            onPress={() => handleSubmit(handleSave)}
            loading={isSubmitting}
            style={styles.saveButton}
            variant="custom"
            customColors={['#404698', '#882785']}
          />

          {/* Return to Login */}
          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 12 }}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.returnText}>Return to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradientText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    top: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -25,
    position: 'relative',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  formContainer: {
    flex: 1,
    marginBottom: 20,
  },
  inputContainer: {
    // marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  matchText: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: -10,
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 20,
    elevation: 8,
  },
  returnText: {
    fontSize: 14,
    color: '#7B68EE',
    fontWeight: '600',
  },
});

export default ResetPasswordScreen;
