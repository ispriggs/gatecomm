// ============================================
// IMPORTS
// React and React Native components we need
// ============================================
import { useState } from 'react'
import { 
  StyleSheet,         // for creating styles
  View,               // like a <div> - container
  Text,               // for displaying text
  TouchableOpacity,   // a pressable button
  Image,              // for displaying images
  TextInput,          // input field for typing
  Alert,              // popup alert messages
  KeyboardAvoidingView, // moves screen up when keyboard appears
  Platform,           // detects if iOS or Android
  ScrollView          // makes content scrollable
} from 'react-native'
import { supabase } from '../../supabase'  // our database connection
import { router } from 'expo-router'        // for navigating between screens


// ============================================
// MAIN SCREEN COMPONENT
// This is the first screen users see
// ============================================
export default function HomeScreen() {

  // ============================================
  // STATE VARIABLES
  // These are like live variables that update the screen when they change
  // ============================================
  const [email, setEmail] = useState('')          // stores what user types in email field
  const [password, setPassword] = useState('')    // stores what user types in password field
  const [loading, setLoading] = useState(false)   // true = show "Logging in..." on button
  const [showLogin, setShowLogin] = useState(false) // true = show login form, false = show main buttons


  // ============================================
  // LOGIN FUNCTION
  // Runs when user taps the Login button
  // ============================================
  const handleLogin = async () => {
    setLoading(true) // show "Logging in..." on button

    // send email and password to Supabase to check if correct
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // if wrong email/password, show error popup
      Alert.alert('Error', error.message)
    } else {
      // if correct, go to dashboard screen
      router.replace('/dashboard')
    }

    setLoading(false) // hide "Logging in..." on button
  }


  // ============================================
  // LOGIN FORM SCREEN
  // Only shows when user taps the Login button
  // showLogin must be true to see this
  // ============================================
  if (showLogin) {
    return (
      // KeyboardAvoidingView pushes screen up when keyboard appears
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ScrollView makes content scrollable so nothing gets hidden behind keyboard */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // allows tapping buttons while keyboard is open
        >
          {/* Logo image */}
          <Image
            source={require('../../assets/Stylized_Leaf_Logo_Design_Fotor-removebg-preview.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* App name */}
          <Text style={styles.brandName}></Text>

          {/* Email input field */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}         // updates email variable as user types
            autoCapitalize="none"           // stops auto capitalising email
            keyboardType="email-address"    // shows email keyboard with @ symbol
          />

          {/* Password input field */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}      // updates password variable as user types
            secureTextEntry                 // hides password with dots
          />

          {/* Login button - calls handleLogin when pressed */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}              // disables button while logging in
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}  {/* changes text while loading */}
            </Text>
          </TouchableOpacity>

          {/* Back button - hides login form and shows main buttons again */}
          <TouchableOpacity onPress={() => setShowLogin(false)}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    )
  }


  // ============================================
  // MAIN WELCOME SCREEN
  // Shows when app first opens (showLogin is false)
  // ============================================
  return (
    <View style={styles.container}>

      {/* Logo image */}
      <Image
        source={require('../../assets/Stylized_Leaf_Logo_Design_Fotor-removebg-preview.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* App name */}
      <Text style={styles.brandName}></Text>

      {/* Main action buttons */}
      <View style={styles.buttonContainer}>

        {/* Login button - shows the login form */}
        <TouchableOpacity style={styles.button} onPress={() => setShowLogin(true)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Create Account button - not built yet */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Visitor gate button - not built yet */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Visitor / Worker Gate</Text>
        </TouchableOpacity>

        {/* Owner/Renter gate button - not built yet */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Owner / Renter Gate</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}


// ============================================
// STYLES
// Like CSS but written in JavaScript
// ============================================
const styles = StyleSheet.create({

  // Main container - full screen white background
container: {
    flex: 1,
    backgroundColor: '#e9e0e0',  // also fix your background colour back to white!
    justifyContent: 'center',
    paddingHorizontal: 8,   // ← reduce this to make inputs wider
    paddingVertical: 24,
  },

  // Scroll container for login form
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 40,
  },

  // Logo sizing
  logo: {
    width: 180,
    height: 180,
    marginBottom: 8,
    alignSelf: 'center',
  },

  // App name text
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a5c38',           // dark green
    marginBottom: 48,
  },

  // Container for the 4 main buttons
  buttonContainer: {
    width: '100%',
    gap: 5,                    // space between buttons
    marginTop: 65,   // pushes buttons downward
  },

  // Green button style
  button: {
    width: '90%',
    backgroundColor: '#1a5c38',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },

  // White text inside buttons
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Email and password input fields
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#1a5c38',
    borderRadius: 8,
    padding: 15,
    marginBottom:6,
    fontSize: 16,
    color: '#333',
    alignSelf: 'center',
  },

  // Back link text
  backText: {
    color: '#1a5c38',
    marginTop: 16,
    fontSize: 16,
  },
})