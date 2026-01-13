// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { Phone, ArrowRight } from 'lucide-react-native';

// import CustomInput from '../../components/common/CustomInput';
// import CustomButton from '../../components/common/CustomButton';
// import Loader from '../../components/common/Loader';
// import colors from '../../constants/colors';
// import { useAuth } from '../../hooks/useAuth';

// const LoginScreen: React.FC = () => {
//   const { login, isLoading } = useAuth() as any;
//   const [mobile, setMobile] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleGetOtp = async () => {
//     if (!mobile || mobile.length < 10) {
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       // For now fixed OTP login
//       await login({ otp: '123456' });
//       // RootNavigator will show Home after auth state updates
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const isValid = mobile && mobile.length >= 10;

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <Loader visible={isLoading || isSubmitting} text="Logging in..." />

//       <LinearGradient
//         colors={[colors.headerGradientStart, colors.headerGradientEnd]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 0, y: 1 }}
//         style={styles.gradientBackground}
//       >
//         <View style={styles.logoCircle}>
//           <Text style={styles.logoText}>T</Text>
//         </View>
//         <Text style={styles.appTitle}>Toagosei FieldForce</Text>
//         <Text style={styles.appSubtitle}>Sales Force Automation</Text>

//         <View style={styles.card}>
//           <View style={styles.cardIconWrapper}>
//             <View style={styles.cardIconCircle}>
//               <Phone size={24} color={colors.headerOrange} />
//             </View>
//           </View>

//           <Text style={styles.cardTitle}>Welcome Back</Text>
//           <Text style={styles.cardSubtitle}>
//             Enter your mobile number to continue
//           </Text>

//           <CustomInput
//             label="Mobile Number"
//             value={mobile}
//             onChangeText={setMobile}
//             keyboardType="phone-pad"
//             placeholder="+91 Mobile Number"
//             leftIcon={<Phone size={18} color={colors.headerOrange} />}
//             required
//           />

//           <CustomButton
//             title="Get OTP"
//             onPress={handleGetOtp}
//             loading={isSubmitting}
//             disabled={!isValid || isSubmitting}
//             variant="custom"
//             customColors={[colors.headerGradientStart, colors.headerGradientEnd]}
//             rightIcon={<ArrowRight size={18} color={colors.white} />}
//           />
//         </View>

//         <Text style={styles.footerText}>
//           Toagosei India Private Limited © 2024
//         </Text>
//       </LinearGradient>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.headerGradientStart,
//   },
//   gradientBackground: {
//     flex: 1,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoCircle: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     backgroundColor: 'rgba(255,255,255,0.25)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   logoText: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: colors.white,
//   },
//   appTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: colors.white,
//     marginBottom: 4,
//   },
//   appSubtitle: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.9)',
//     marginBottom: 32,
//   },
//   card: {
//     width: '100%',
//     backgroundColor: colors.white,
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   cardIconWrapper: {
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   cardIconCircle: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: 'rgba(255,107,53,0.08)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: colors.dark,
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   cardSubtitle: {
//     fontSize: 13,
//     color: colors.gray,
//     textAlign: 'center',
//     marginTop: 4,
//     marginBottom: 16,
//   },
//   footerText: {
//     position: 'absolute',
//     bottom: 24,
//     fontSize: 11,
//     color: 'rgba(255,255,255,0.9)',
//   },
// });

// export default LoginScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Phone, ArrowRight } from 'lucide-react-native';

import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import Loader from '../../components/common/Loader';
import colors from '../../constants/colors';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetOtp = async () => {
    if (!mobile || mobile.length < 10) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', { mobile });
    }, 1000);
  };

  const isValid = mobile && mobile.length >= 10;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Loader visible={isSubmitting} text="Sending OTP..." />

      <LinearGradient
        colors={[colors.headerGradientStart, colors.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>T</Text>
        </View>
        <Text style={styles.appTitle}>Toagosei FieldForce</Text>
        <Text style={styles.appSubtitle}>Sales Force Automation</Text>

        <View style={styles.card}>
          <View style={styles.cardIconWrapper}>
            <View style={styles.cardIconCircle}>
              <Phone size={24} color={colors.headerOrange} />
            </View>
          </View>

          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>
            Enter your mobile number to continue
          </Text>

          <CustomInput
            label="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            placeholder="+91 Mobile Number"
            leftIcon={<Phone size={18} color={colors.headerOrange} />}
            required
          />

          <CustomButton
            title="Get OTP"
            onPress={handleGetOtp}
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            variant="custom"
            customColors={[colors.headerGradientStart, colors.headerGradientEnd]}
            rightIcon={<ArrowRight size={18} color={colors.white} />}
          />
        </View>

        <Text style={styles.footerText}>
          Toagosei India Private Limited © 2024
        </Text>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.headerGradientStart,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 32,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cardIconWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,107,53,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  footerText: {
    position: 'absolute',
    bottom: 24,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
  },
});

export default LoginScreen;