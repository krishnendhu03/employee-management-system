
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: 'Dashboard' }}
      />

      <Tabs.Screen
        name="explore"
        options={{ title: 'Employees' }}
      />

      <Tabs.Screen
        name="add"
        options={{ title: 'Add Employee' }}
      />
    </Tabs>
  );
}
