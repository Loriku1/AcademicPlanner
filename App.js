import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

// Create screens (we'll implement these next)

import CourseSchedule from './src/components/screens/CourseSchedule';

import Assignments from './src/components/screens/Assignments';

import GradeCalculator from './src/components/screens/GradeCalculator';

import Reminders from './src/components/screens/Reminders';

const Tab = createBottomTabNavigator();

export default function App() {

  return (

    <NavigationContainer>

      <Tab.Navigator

        screenOptions={({ route }) => ({

          tabBarIcon: ({ color, size }) => {

            const icons = {

              Schedule: 'calendar',

              Assignments: 'list',

              Grades: 'calculator',

              Reminders: 'alarm'

            };

            return <Ionicons name={icons[route.name]} size={size} color={color} />;

          },

        })}

      >

        <Tab.Screen name="Schedule" component={CourseSchedule} />

        <Tab.Screen name="Assignments" component={Assignments} />

        <Tab.Screen name="Grades" component={GradeCalculator} />

        <Tab.Screen name="Reminders" component={Reminders} />

      </Tab.Navigator>

    </NavigationContainer>

  );

}
