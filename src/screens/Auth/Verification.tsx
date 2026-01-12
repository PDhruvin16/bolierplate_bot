import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import CustomButton from '../../components/common/CustomButton';
import Loader from '../../components/common/Loader';
import GradientHeader from '../../components/common/Authheader';
import images from '../../constants/images';
import { useAuth } from '../../context/AuthContext';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

type VerificationScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Verification'
>;

const VerificationScreen: React.FC = () => {
  const navigation = useNavigation<VerificationScreenNavigationProp>();
  const { isLoading } = useAuth() as any;
  const { theme } = useTheme();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerify = () => {
    Alert.alert('OTP Entered', otp.join(''));
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
    otpBox: {
      ...styles.otpBox,
      backgroundColor: theme === 'dark' ? '#2F2F2F' : '#F2F2F2',
      color: theme === 'dark' ? '#FFFFFF' : '#000',
      borderColor: theme === 'dark' ? '#707070' : '#D1D1D1',
    },
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Loader visible={isLoading} text="Verifying..." />

      {/* Header */}
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
        {/* Title */}
        <View style={styles.headerContent}>
          <Text style={themedestyle.headerTitle}>Verification</Text>
          <Text style={themedestyle.headerSubtitle}>
            We sent you a code on example@gmail.com
          </Text>
        </View>

        {/* OTP Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputs.current[index] = ref!)}
              style={themedestyle.otpBox}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              //   placeholder="-"
              placeholderTextColor="#B0B0B0"
            />
          ))}
        </View>

        {/* Timer + Resend */}
        <View style={styles.timerRow}>
          <Text style={styles.timerText}>00:30s</Text>
          <TouchableOpacity>
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <CustomButton
          title="Verify"
          onPress={handleVerify}
          style={styles.loginButton}
          variant="custom"
          customColors={['#404698', '#882785']}
        />

        {/* Return to Login */}
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
              <Text style={[styles.gradientText, { opacity: 0 }]}>
                Return to Login
              </Text>
            </LinearGradient>
          </MaskedView>
        </TouchableOpacity>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderRadius: 7,
    backgroundColor: '#F2F2F2',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    // borderWidth:1,
    // borderColor:'#D1D1D1',
    borderBottomColor: '#707070',
    borderBottomWidth: 1,
    borderWidth: 1,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timerText: {
    color: '#555',
    fontWeight: '500',
    fontSize: 14,
  },
  resendText: {
    color: '#7B68EE',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 20,
    elevation: 8,
  },
  gradientText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VerificationScreen;
