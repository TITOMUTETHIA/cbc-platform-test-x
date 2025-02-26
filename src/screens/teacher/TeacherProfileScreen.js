// src/screens/teacher/TeacherProfileScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const TeacherProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Profile</Text>
      <TextInput style={styles.input} placeholder="Teacher Name" />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Subjects" />
      <Button title="Save" onPress={() => { /* Handle Save */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default TeacherProfileScreen;
