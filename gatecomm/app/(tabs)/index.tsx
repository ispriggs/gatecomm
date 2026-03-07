// ============================================
// IMPORTS
// ============================================
import { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import { supabase } from '../../supabase'
import { router } from 'expo-router'


// ============================================
// MAIN SCREEN COMPONENT
// ============================================
export default function HomeScreen() {

  // ============================================
  // STATE VARIABLES
  // ============================================
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [hasStoredSession, setHasStoredSession] = useState(false)  // true = returning user
  const [faceIDAvailable, setFaceIDAvailable] = useState(false)    // true = device supports Face ID


  // ============================================
  // ON MOUNT - Check for existing session and Face ID support
  // ============================================
  useEffect(() => {
    checkSessionAndBiometrics()
  }, [])

  const checkSessionAndBiometrics = async () => {
    // Check if device supports biometrics (Face ID / Touch ID)
    const compatible = await LocalAuthentication.hasHardwareAsync()
    const enrolled = await LocalAuthentication.isEnrolledAsync()
    const biometricsAvailable = compatible && enrolled
    setFaceIDAvailable(biometricsAvailable)

    // Check if there's an existing Supabase session (returning user)
    const { data: { session } } = await supabase.auth.getSession()

    if (session && biometricsAvailable) {
      // Returning user with Face ID available - prompt immediately
      setHasStoredSession(true)
      triggerFaceID()
    }
  }


  // ============================================
  // FACE ID AUTHENTICATION
  // ============================================
  const triggerFaceID = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Face ID',
      fallbackLabel: 'Use Password',         // shows on Face ID failure
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,           // allows PIN fallback on device
    })

    if (result.success) {
      // Face ID passed - check session is still valid then go to dashboard
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/dashboard')
      } else {
        // Session expired - show login form
        setHasStoredSession(false)
        setShowLogin(true)
      }
    }
    // If Face ID fails or cancelled, user stays on screen and can use email/password
  }


  // ============================================
  // EMAIL / PASSWORD LOGIN
  // ============================================
  const handleLogin = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      router.replace('/dashboard')
    }

    setLoading(false)
  }


  // ============================================
  // LOGIN FORM SCREEN (fallback)
  // ============================================
  if (showLogin) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Image
            source={require('../../assets/Stylized_Leaf_Logo_Design_Fotor-removebg-preview.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.brandName}></Text>

          {/* Email input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Password input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Login button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Face ID button - only show if available */}
          {faceIDAvailable && hasStoredSession && (
            <TouchableOpacity onPress={triggerFaceID}>
              <Text style={styles.faceIDText}>🔒 Use Face ID instead</Text>
            </TouchableOpacity>
          )}

          {/* Back button */}
          <TouchableOpacity onPress={() => setShowLogin(false)}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    )
  }


  // ============================================
  // MAIN WELCOME SCREEN
  // ============================================
  return (
    <View style={styles.container}>

      {/* Logo */}
      <Image
        source={require('../../assets/Stylized_Leaf_Logo_Design_Fotor-removebg-preview.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.brandName}></Text>

      <View style={styles.buttonContainer}>

        {/* Face ID button for returning users */}
        {hasStoredSession && faceIDAvailable && (
          <TouchableOpacity style={styles.faceIDButton} onPress={triggerFaceID}>
            <Text style={styles.buttonText}>🔒 Login with Face ID</Text>
          </TouchableOpacity>
        )}

        {/* Login with email/password */}
        <TouchableOpacity style={styles.button} onPress={() => setShowLogin(true)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Create Account */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Visitor gate */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Visitor / Worker Gate</Text>
        </TouchableOpacity>

        {/* Owner/Renter gate */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Owner / Renter Gate</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}


// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#e9e0e0',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 24,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 40,
  },

  logo: {
    width: 180,
    height: 180,
    marginBottom: 8,
    alignSelf: 'center',
  },

  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a5c38',
    marginBottom: 48,
  },

  buttonContainer: {
    width: '100%',
    gap: 5,
    marginTop: 65,
  },

  button: {
    width: '90%',
    backgroundColor: '#1a5c38',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },

  // Face ID button - slightly different style to stand out
  faceIDButton: {
    width: '90%',
    backgroundColor: '#0a3d22',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a5c38',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#1a5c38',
    borderRadius: 8,
    padding: 15,
    marginBottom: 6,
    fontSize: 16,
    color: '#333',
    alignSelf: 'center',
  },

  backText: {
    color: '#1a5c38',
    marginTop: 16,
    fontSize: 16,
  },

  faceIDText: {
    color: '#1a5c38',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
})