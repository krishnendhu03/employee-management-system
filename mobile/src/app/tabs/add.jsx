
import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import API from '../../services/api';

export default function AddEmployeeScreen() {
  // Store employee form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Active');

  // Store validation errors
  const [emailError, setEmailError] = useState('');
  const [salaryError, setSalaryError] = useState('');

  // Save employee function
  const handleSaveEmployee = async () => {
    console.log('1. SAVE FUNCTION STARTED');

    // Clear previous errors
    setEmailError('');
    setSalaryError('');

    // Validate required fields
    if (
      !name.trim() ||
      !email.trim() ||
      !department.trim() ||
      !designation.trim()
    ) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields.'
      );
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Validate salary is required
    if (!salary.trim()) {
      setSalaryError('Salary is required.');
      return;
    }

    // Validate salary contains numbers only
    if (!/^\d+$/.test(salary.trim())) {
      setSalaryError('Salary must contain numbers only.');
      return;
    }

    // Validate salary is greater than zero
    if (Number(salary) <= 0) {
      setSalaryError('Salary must be greater than zero.');
      return;
    }

    try {
      // Prepare employee data
      const employeeData = {
        name: name.trim(),
        email: email.trim(),
        department: department.trim(),
        designation: designation.trim(),
        salary: Number(salary),
        status: status,
      };

      console.log(
        '3. Sending employee data:',
        employeeData
      );

      // Send data to backend
      const response = await API.post(
        '/api/employees',
        employeeData
      );

      console.log(
        '4. Backend response:',
        response.data
      );

      console.log(
        '5. Backend status:',
        response.status
      );

      // Show success message
      Alert.alert(
        'Success',
        'Employee added successfully!'
      );

      // Clear the form
      setName('');
      setEmail('');
      setDepartment('');
      setDesignation('');
      setSalary('');
      setStatus('Active');
      setEmailError('');
      setSalaryError('');

    } catch (error) {
      console.log('API ERROR:', error);
      console.log(
        'API response:',
        error.response?.data
      );

      // Handle duplicate email
      if (error.response?.status === 409) {
        setEmailError(
          'This email address already exists. Please use another email.'
        );
        return;
      }

      // Handle other errors
      Alert.alert(
        'Error',
        error.response?.data?.error ||
        error.message ||
        'Unable to save employee.'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Employee</Text>

      <Text style={styles.subtitle}>
        Enter the employee details below
      </Text>

      <View style={styles.formCard}>

        {/* Employee Name */}
        <Text style={styles.label}>
          Employee Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter employee name"
          value={name}
          onChangeText={setName}
        />

        {/* Email */}
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={[
            styles.input,
            emailError ? styles.inputError : null,
          ]}
          placeholder="Enter email address"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setEmailError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Email Error */}
        {emailError ? (
          <Text style={styles.errorText}>
            {emailError}
          </Text>
        ) : null}

        {/* Department */}
        <Text style={styles.label}>
          Department
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter department"
          value={department}
          onChangeText={setDepartment}
        />

        {/* Designation */}
        <Text style={styles.label}>
          Designation
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter designation"
          value={designation}
          onChangeText={setDesignation}
        />

        {/* Salary */}
        <Text style={styles.label}>
          Salary
        </Text>

        <TextInput
          style={[
            styles.input,
            salaryError ? styles.inputError : null,
          ]}
          placeholder="Enter salary"
          value={salary}
          onChangeText={(value) => {
            setSalary(value);
            setSalaryError('');
          }}
          keyboardType="numeric"
        />

        {/* Salary Error */}
        {salaryError ? (
          <Text style={styles.errorText}>
            {salaryError}
          </Text>
        ) : null}

        {/* Status */}
        <Text style={styles.label}>
          Status
        </Text>

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

        {/* Save Employee Button */}
        <Pressable
          style={styles.submitButton}
          onPress={handleSaveEmployee}
        >
          <Text style={styles.submitText}>
            Save Employee
          </Text>
        </Pressable>

      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
    padding: 16,
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

  inputError: {
    borderColor: '#DC2626',
  },

  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 6,
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
