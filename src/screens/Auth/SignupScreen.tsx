import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { COLORS } from '../../context/ThemeContext';
import { STRINGS } from '../../constants/strings';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import Loader from '../../components/common/Loader';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from 'type';
type SignupScreenProp = StackNavigationProp<AuthStackParamList, 'Login'>;
const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenProp>();
  const { register, isLoading, error } = useAuth();

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignup = async formValues => {
    try {
      // Validate password confirmation
      if (formValues.password !== formValues.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...signupData } = formValues;
      await register(signupData);

      Alert.alert('Success', 'Account created successfully!');
      // Navigation will be handled by the auth context
    } catch (error) {
      Alert.alert(
        'Signup Failed',
        error.message || 'Please check your information',
      );
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      <Loader visible={isLoading} text="Creating account..." />

      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join {STRINGS.APP_NAME} today!</Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="Full Name"
          value={values.name}
          onChangeText={text => handleChange('name', text)}
          placeholder="Enter your full name"
          autoCapitalize="words"
          leftIcon="👤"
          error={errors.name}
        />

        <CustomInput
          label={STRINGS.EMAIL}
          value={values.email}
          onChangeText={text => handleChange('email', text)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          leftIcon="📧"
          error={errors.email}
        />

        <CustomInput
          label={STRINGS.PASSWORD}
          value={values.password}
          onChangeText={text => handleChange('password', text)}
          placeholder="Enter your password"
          secureTextEntry
          leftIcon="🔒"
          error={errors.password}
        />

        <CustomInput
          label={STRINGS.CONFIRM_PASSWORD}
          value={values.confirmPassword}
          onChangeText={text => handleChange('confirmPassword', text)}
          placeholder="Confirm your password"
          secureTextEntry
          leftIcon="🔒"
          error={errors.confirmPassword}
        />

        <CustomButton
          title={STRINGS.SIGNUP}
          onPress={() => handleSubmit(handleSignup)}
          loading={isSubmitting}
          style={styles.signupButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{STRINGS.ALREADY_HAVE_ACCOUNT}</Text>
        <CustomButton
          title={STRINGS.SIGN_IN_HERE}
          onPress={navigateToLogin}
          variant="outline"
          size="small"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.gray,
  },
  form: {
    marginBottom: 30,
  },
  signupButton: {
    marginTop: 20,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 12,
  },
});

export default SignupScreen;
