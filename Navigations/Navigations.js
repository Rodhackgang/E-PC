import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Homepage from '../Screens/Homepage';
import ConcoursDirect from '../Screens/ConcoursDirect';
import ConcoursProfessionnel from '../Screens/ConcoursProfessionnel';
import Onboarding from '../Screens/Onboarding';
import Detailssujetdirect from '../Screens/Detailssujetdirect';
import Detailscorrigerdirect from '../Screens/Detailscorrigerdirect';
import Detailsqcmdirect from '../Screens/Detailsqcmdirect';
import Detailssujetprofesionel from '../Screens/Detailssujetprofesionel';
import DetailsListqcmpc from '../Screens/DetailsListqcmpc';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: '#f9f9f9',
          borderTopRightRadius: 70,
          borderBottomRightRadius: 70,
          shadowColor: '#000',
          shadowOffset: { width: -2, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        drawerContentStyle: {
          borderTopRightRadius: 70,
          borderBottomRightRadius: 70,
        },
        drawerActiveBackgroundColor: '#e0e0e0',
        drawerInactiveTintColor: '#333',
        drawerActiveTintColor: '#007bff',
      }}
    >
      <Drawer.Screen 
        name="Acceuil" 
        component={Homepage} 
      />
      <Drawer.Screen 
        name="Concours Direct" 
        component={ConcoursDirect} 
      />
      <Drawer.Screen 
        name="Concours Professionnel" 
        component={ConcoursProfessionnel} 
      />
    </Drawer.Navigator>
  );
}

export default function Navigations() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="Onboarding" 
        component={Onboarding} 
      />
      <Stack.Screen 
        name="Main" 
        component={DrawerNavigator} 
      />
      <Stack.Screen 
        name="Detailssujetdirect" 
        component={Detailssujetdirect} 
      />
      <Stack.Screen 
        name="Detailscorrigerdirect" 
        component={Detailscorrigerdirect} 
      />
      <Stack.Screen 
        name="Detailsqcmdirect" 
        component={Detailsqcmdirect} 
      />
      <Stack.Screen 
        name="Detailssujetprofesionel" 
        component={Detailssujetprofesionel} 
      />
      <Stack.Screen 
        name="DetailsListqcmpc" 
        component={DetailsListqcmpc} 
      />
    </Stack.Navigator>
  );
}
