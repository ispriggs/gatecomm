// ============================================
// IMPORTS
// ============================================
import { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { supabase } from '../supabase'
import { router } from 'expo-router'

// ============================================
// MAIN REGISTER SCREEN COMPONENT
// ============================================
export default function RegisterScreen() {

  // ============================================
  // STATE VARIABLES
  // ============================================
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [unitNumber, setUnitNumber] = useState('')
  const [role, setRole] = useState<'owner' | 'renter' | 'admin'>('owner')
  const [arrivalDate, setArrivalDate] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [loading, setLoading] = useState(false)

  // ============================================
  // REGISTER FUNCTION
  // ============================================
  const handleRegister = async () => {

    // Basic validation
    if (!fullName || !email || !password || !phone || !unitNumber) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    if (role === 'renter' && (!arrivalDate || !departureDate)) {
      Alert.alert('Error', 'Renters must provide arrival and departure dates')
      return
    }

    setLoading(true)

    // Admins are auto-approved, everyone else is pending
    const status = role === 'admin' ? 'approved' : 'pending'

    // Create auth account and pass all profile data via options.data
    // The database trigger (handle_new_user) reads raw_user_meta_data
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          unit_number: unitNumber,
          role: role,
          status: status,
          arrival_date: role === 'renter' ? arrivalDate : null,
          departure_date: role === 'renter' ? departureDate : null,
        }
      }
    })

    if (error) {
      Alert.alert('Error', error.message)
      setLoading(false)
      return
    }

    setLoading(false)

    // Different success message depending on role
    if (role === 'admin') {
      Alert.alert(
        'Admin Account Created!',
        'Your admin account is ready. You can now log in.',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      )
    } else {
      Alert.alert(
        'Account Created!',
        'Your account is pending approval. You will be notified once an admin approves your account.',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      )
    }
  }

  // ============================================
  // REGISTER FORM SCREEN
  // ============================================
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        {/* Header */}
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>Fill in your details to request access</Text>

        {/* ---------------------------------------- */}
        {/* PERSONAL DETAILS SECTION */}
        {/* ---------------------------------------- */}
        <Text style={styles.sectionTitle}>Personal Details</Text>

        {/* Full name input */}
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="John Smith"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email input */}
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="john@example.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Phone input */}
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="+1 234 567 8900"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* ---------------------------------------- */}
        {/* PROPERTY DETAILS SECTION */}
        {/* ---------------------------------------- */}
        <Text style={styles.sectionTitle}>Property Details</Text>

        {/* Unit number input */}
        <Text style={styles.label}>Unit Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 14"
          placeholderTextColor="#999"
          value={unitNumber}
          onChangeText={setUnitNumber}
        />

        {/* Role selector - Owner, Renter or Admin */}
        <Text style={styles.label}>I am a *</Text>
        <View style={styles.roleContainer}>

          {/* Owner button */}
          <TouchableOpacity
            style={[styles.roleButton, role === 'owner' && styles.roleButtonActive]}
            onPress={() => setRole('owner')}
          >
            <Text style={[styles.roleButtonText, role === 'owner' && styles.roleButtonTextActive]}>
              Owner
            </Text>
          </TouchableOpacity>

          {/* Renter button */}
          <TouchableOpacity
            style={[styles.roleButton, role === 'renter' && styles.roleButtonActive]}
            onPress={() => setRole('renter')}
          >
            <Text style={[styles.roleButtonText, role === 'renter' && styles.roleButtonTextActive]}>
              Renter
            </Text>
          </TouchableOpacity>

          {/* Admin button */}
          <TouchableOpacity
            style={[styles.roleButton, role === 'admin' && styles.roleButtonAdmin]}
            onPress={() => setRole('admin')}
          >
            <Text style={[styles.roleButtonText, role === 'admin' && styles.roleButtonTextActive]}>
              Admin
            </Text>
          </TouchableOpacity>

        </View>

        {/* Admin notice */}
        {role === 'admin' && (
          <View style={styles.adminNotice}>
            <Text style={styles.adminNoticeText}>
              ⚡ Admin accounts are approved instantly
            </Text>
          </View>
        )}

        {/* ---------------------------------------- */}
        {/* RENTER DATES SECTION */}
        {/* Only shows if user selected Renter */}
        {/* ---------------------------------------- */}
        {role === 'renter' && (
          <View>
            <Text style={styles.sectionTitle}>Rental Period</Text>

            {/* Arrival date */}
            <Text style={styles.label}>Arrival Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#999"
              value={arrivalDate}
              onChangeText={setArrivalDate}
            />

            {/* Departure date */}
            <Text style={styles.label}>Departure Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#999"
              value={departureDate}
              onChangeText={setDepartureDate}
            />
          </View>
        )}

        {/* ---------------------------------------- */}
        {/* PASSWORD SECTION */}
        {/* ---------------------------------------- */}
        <Text style={styles.sectionTitle}>Set Password</Text>

        {/* Password input */}
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Minimum 6 characters"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Confirm password input */}
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Repeat your password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* ---------------------------------------- */}
        {/* SUBMIT BUTTON */}
        {/* ---------------------------------------- */}
        <TouchableOpacity
          style={[styles.button, role === 'admin' && styles.buttonAdmin]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        {/* Back to login */}
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a5c38',
    marginBottom: 4,
    marginTop: 60,
  },

  subheading: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a5c38',
    marginTop: 24,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },

  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 6,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#1a5c38',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },

  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  roleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1a5c38',
    alignItems: 'center',
  },

  roleButtonActive: {
    backgroundColor: '#1a5c38',
  },

  // Admin button gets amber colour when selected
  roleButtonAdmin: {
    backgroundColor: '#b45309',
    borderColor: '#b45309',
  },

  roleButtonText: {
    color: '#1a5c38',
    fontWeight: '600',
    fontSize: 16,
  },

  roleButtonTextActive: {
    color: '#ffffff',
  },

  // Admin notice banner
  adminNotice: {
    backgroundColor: '#fef3c7',
    borderColor: '#b45309',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  adminNoticeText: {
    color: '#b45309',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#1a5c38',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
    marginBottom: 16,
  },

  // Admin submit button turns amber
  buttonAdmin: {
    backgroundColor: '#b45309',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  backText: {
    color: '#1a5c38',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
})