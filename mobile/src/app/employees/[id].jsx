
import { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useLocalSearchParams, router } from 'expo-router';
import API from '../../services/api';

export default function EditEmployeeScreen() {
  // Get employee ID from the URL
  const { id } = useLocalSearchParams();

  // Store employee details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Active');

  const [loading, setLoading] = useState(true);

  // Fetch the selected employee
  const fetchEmployee = async () => {
    try {
      const response = await API.get(`/api/employees/${id}`);

      const employee = response.data;

      setName(employee.name);
      setEmail(employee.email);
      setDepartment(employee.department);
      setDesignation(employee.designation);
      setSalary(String(employee.salary));
      setStatus(employee.status);
    } catch (error) {
      console.log('Fetch Employee Error:', error.message);
      Alert.alert('Error', 'Unable to load employee details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  // Update employee details
  
  const handleUpdateEmployee = async () => {
    
  console.log('UPDATE FUNCTION STARTED');

  // Existing validation continues here
    if (
      !name.trim() ||
      !email.trim() ||
      !department.trim() ||
      !designation.trim() ||
      !salary.trim()
    ) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }

    if (!Number.isFinite(Number(salary)) || Number(salary) <= 0) {
      Alert.alert('Invalid Salary', 'Enter a valid salary.');
      return;
    }

    try {
      const employeeData = {
        name: name.trim(),
        email: email.trim(),
        department: department.trim(),
        designation: designation.trim(),
        salary: Number(salary),
        status,
      };
       console.log('Sending update:', employeeData);
      await API.patch(`/api/employees/${id}`, employeeData);
      console.log('UPDATE SUCCESS');
      Alert.alert('Success', 'Employee updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.log('Update Employee Error:', error);
      Alert.alert('Error', 'Unable to update employee.');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Loading employee details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Employee</Text>

      <Text style={styles.subtitle}>
        Update employee information
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Employee Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Department</Text>
        <TextInput
          style={styles.input}
          value={department}
          onChangeText={setDepartment}
        />

        <Text style={styles.label}>Designation</Text>
        <TextInput
          style={styles.input}
          value={designation}
          onChangeText={setDesignation}
        />

        <Text style={styles.label}>Salary</Text>
        <TextInput
          style={styles.input}
          value={salary}
          onChangeText={setSalary}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Status</Text>

        <View style={styles.statusContainer}>
          {['Active', 'Inactive'].map((item) => (
            <Pressable
              key={item}
              style={[
                styles.statusButton,
                status === item && styles.selectedStatus,
              ]}
              onPress={() => setStatus(item)}
            >
              <Text
                style={[
                  styles.statusText,
                  status === item && styles.selectedStatusText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
  style={styles.submitButton}
  onPress={handleUpdateEmployee}
>
  <Text style={styles.submitText}>
    Update Employee
  </Text>
</Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    color: '#64748B',
    marginTop: 5,
    marginBottom: 18,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 5,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  selectedStatus: {
    backgroundColor: '#2563EB',
  },
  statusText: {
    color: '#334155',
    fontWeight: '600',
  },
  selectedStatusText: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
