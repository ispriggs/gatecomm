import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../supabase'

const menuItems = [
  { title: 'Directory', color: '#e8d5b7', textColor: '#8B6914' },
  { title: 'Voting', color: '#c8ddc8', textColor: '#2D6A4F' },
  { title: 'News', color: '#f5e6b2', textColor: '#8B6914' },
  { title: 'Documents', color: '#b2d4d4', textColor: '#1a5c38' },
  { title: 'Stats', color: '#d4c8c0', textColor: '#5c3d2e' },
  { title: 'Events', color: '#d4c8e8', textColor: '#4a3580' },
  { title: 'FAQ', color: '#c8d8c8', textColor: '#2D6A4F' },
  { title: 'Gate', color: '#c8d8c8', textColor: '#2D6A4F' },
  { title: 'Forms', color: '#f5e6b2', textColor: '#8B6914' },
  { title: 'A&E', color: '#f5b8b8', textColor: '#c0392b' },
  { title: 'Admin', color: '#f5c8b8', textColor: '#c0392b' },
  { title: 'Amenities', color: '#d0d0d0', textColor: '#333' },
  { title: 'Flora & Fauna', color: '#c8e8c8', textColor: '#1a5c38' },
  { title: 'Hiking', color: '#b8d4e8', textColor: '#1a5c7a' },
]

export default function Dashboard() {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>👤 Your Account</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOut}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={[styles.tile, { backgroundColor: item.color }]}
          >
            <Text style={[styles.tileText, { color: item.textColor }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  headerText: {
    fontSize: 16,
    color: '#1a5c38',
    fontWeight: '600',
  },
  signOut: {
    fontSize: 14,
    color: '#c0392b',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  tile: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tileText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
})