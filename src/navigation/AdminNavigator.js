// src/navigation/AdminNavigator.js
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

const Stack = createStackNavigator();

const AdminNavigator = () => (
  <Stack.Navigator initialRouteName="AdminDashboard">
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
  </Stack.Navigator>
);

export default AdminNavigator;
