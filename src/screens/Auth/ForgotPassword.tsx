import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { useForm } from '../../hooks/useForm';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import Loader from '../../components/common/Loader';
import GradientHeader from '../../components/common/Authheader';
import images from '../../constants/images';
import { useAuth } from '../../context/AuthContext';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { isLoading } = useAuth() as any;
  const { theme } = useTheme();
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm<{
    email: string;
  }>({
    email: '',
  });

  const handleSendCode = async (_formValues: { email: string }) => {
    try {
      Alert.alert('Success', 'Verification code sent successfully!');
      // You can navigate to OTP verification here
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Something went wrong');
    }
  };
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
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Loader visible={isLoading} text="Sending code..." />

      <View style={{ backgroundColor: 'violet' }}>
        <GradientHeader
          logoSource={images.AppLogo}
          logoStyle={{
            width: 200,
            height: 100,
            marginBottom: 20,
            backgroundColor: 'violet',
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

      <ScrollView
        style={themedestyle.contentContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.headerContent}>
          <Text style={themedestyle.headerTitle}>Forgot Password ?</Text>
          <Text numberOfLines={2} style={themedestyle.headerSubtitle}>
            No worries. Enter your account email address and we will share a
            reset link
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <CustomInput
              label="Email"
              value={values.email}
              onChangeText={text => handleChange('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />
          </View>

          <CustomButton
            title="Send Code"
            onPress={() => handleSubmit(handleSendCode)}
            loading={isSubmitting}
            style={styles.loginButton}
            variant="custom"
            customColors={['#404698', '#882785']}
          />

          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 12 }}
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
                  Return to Login
                </Text>
              }
            >
              <LinearGradient
                colors={['#404698', '#882785']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {/* Give gradient same size as the text */}
                <Text style={[styles.gradientText, { opacity: 0 }]}>
                  Return to Login
                </Text>
              </LinearGradient>
            </MaskedView>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  loginButton: {
    marginBottom: 20,
    elevation: 8,
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
  gradientText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
