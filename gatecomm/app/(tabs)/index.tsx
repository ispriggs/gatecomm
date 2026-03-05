import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      <Image
        source={require('../../assets/Stylized_Leaf_Logo_Design_Fotor-removebg-preview.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.brandName}>GateComm</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Visitor / Worker Gate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Owner / Renter Gate</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a5c38',
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#1a5c38',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});