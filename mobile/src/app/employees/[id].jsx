
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
  Modal,
} from 'react-native';

import { useLocalSearchParams, router } from 'expo-router';
import API from '../../services/api';

export default function EditEmployeeScreen() {
  // Get employee ID from URL
  const { id } = useLocalSearchParams();

  // Employee form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Active');

  // Loading state
  const [loading, setLoading] = useState(true);

  // Validation error states
  const [emailError, setEmailError] = useState('');
  const [salaryError, setSalaryError] = useState('');

  // Success popup state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch selected employee
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
      console.log('Fetch Employee Error:', error);
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

    // Clear previous errors
    setEmailError('');
    setSalaryError('');

    // Validate required fields except salary
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

      // Show success popup
      setShowSuccessModal(true);

    } catch (error) {
      console.log('Update Employee Error:', error);
      console.log('API response:', error.response?.data);

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
        'Unable to update employee.'
      );
    }
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Loading employee details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>

      {/* Edit Employee Form */}
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Edit Employee</Text>

        <Text style={styles.subtitle}>
          Update employee information
        </Text>

        <View style={styles.formCard}>

          {/* Employee Name */}
          <Text style={styles.label}>Employee Name</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>

          <TextInput
            style={[
              styles.input,
              emailError ? styles.inputError : null,
            ]}
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
          <Text style={styles.label}>Department</Text>

          <TextInput
            style={styles.input}
            value={department}
            onChangeText={setDepartment}
          />

          {/* Designation */}
          <Text style={styles.label}>Designation</Text>

          <TextInput
            style={styles.input}
            value={designation}
            onChangeText={setDesignation}
          />

          {/* Salary */}
          <Text style={styles.label}>Salary</Text>

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

          {/* Update Button */}
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

      {/* Success Popup */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.successIcon}>✓</Text>

            <Text style={styles.modalTitle}>
              Success!
            </Text>

            <Text style={styles.modalMessage}>
              Employee updated successfully.
            </Text>

            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/tabs/explore');
              }}
            >
              <Text style={styles.modalButtonText}>
                OK
              </Text>
            </Pressable>

          </View>
        </View>
      </Modal>

    </View>
  );
}

// Styles
const styles = StyleSheet.create({

  screen: {
    flex: 1,
  },

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

  // Success popup styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 350,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },

  successIcon: {
    fontSize: 42,
    color: '#16A34A',
    fontWeight: 'bold',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 10,
  },

  modalMessage: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 10,
    textAlign: 'center',
  },

  modalButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 22,
  },

  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

});
