
import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';

import { router } from 'expo-router';
import API from '../../services/api';

export default function AddEmployeeScreen() {
  // Form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Active');

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [salaryError, setSalaryError] = useState('');

  // Success popup
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Save employee
  const handleSaveEmployee = async () => {
    setEmailError('');
    setSalaryError('');

    // Required field validation
    if (
      !name.trim() ||
      !email.trim() ||
      !department.trim() ||
      !designation.trim()
    ) {
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Salary validation
    if (!salary.trim()) {
      setSalaryError('Salary is required.');
      return;
    }

    if (!/^\d+$/.test(salary.trim())) {
      setSalaryError('Salary must contain numbers only.');
      return;
    }

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
        status: status,
      };

      const response = await API.post(
        '/api/employees',
        employeeData
      );

      console.log('Employee added:', response.data);

      // Clear the form
      setName('');
      setEmail('');
      setDepartment('');
      setDesignation('');
      setSalary('');
      setStatus('Active');
      setEmailError('');
      setSalaryError('');

      // Show success popup
      setShowSuccessModal(true);

    } catch (error) {
      console.log('API ERROR:', error);
      console.log('API response:', error.response?.data);

      // Duplicate email
      if (error.response?.status === 409) {
        setEmailError(
          'This email address already exists. Please use another email.'
        );
        return;
      }

      setEmailError(
        error.response?.data?.error ||
        error.message ||
        'Unable to save employee.'
      );
    }
  };

  // Close popup and navigate
  const handleSuccessOK = () => {
    setShowSuccessModal(false);
    router.replace('/tabs/explore');
  };

  return (
    <View style={styles.screen}>

      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Employee</Text>

        <Text style={styles.subtitle}>
          Enter the employee details below
        </Text>

        <View style={styles.formCard}>

          {/* Employee Name */}
          <Text style={styles.label}>Employee Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter employee name"
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
            placeholder="Enter email address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {emailError ? (
            <Text style={styles.errorText}>
              {emailError}
            </Text>
          ) : null}

          {/* Department */}
          <Text style={styles.label}>Department</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter department"
            value={department}
            onChangeText={setDepartment}
          />

          {/* Designation */}
          <Text style={styles.label}>Designation</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter designation"
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

          {/* Save Button */}
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

      {/* Success Modal */}
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
              Employee added successfully!
            </Text>

            <Pressable
              style={styles.modalButton}
              onPress={handleSuccessOK}
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
    backgroundColor: '#F3F6FA',
  },

  container: {
    flex: 1,
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalCard: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },

  successIcon: {
    fontSize: 45,
    color: '#16A34A',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 22,
  },

  modalButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },

  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

});
