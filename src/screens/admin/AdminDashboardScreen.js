// src/screens/admin/AdminDashboardScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AdminDashboardScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>Admin Dashboard</Text>
    <Button
      title="Go to Profile"
      onPress={() => navigation.navigate('AdminProfile')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminDashboardScreen;
