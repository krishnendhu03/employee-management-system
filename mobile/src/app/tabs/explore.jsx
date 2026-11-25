
import { useState, useEffect } from 'react';

import { router } from 'expo-router';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';

import API from '../../services/api';

export default function EmployeesScreen() {
  // Store employee records
  const [employees, setEmployees] = useState([]);

  // Search and filter
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete confirmation popup
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Selected employee for deletion
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Delete success/error popup
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultTitle, setResultTitle] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Track delete loading
  const [deleting, setDeleting] = useState(false);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await API.get('/api/employees');

      setEmployees(response.data);
    } catch (error) {
      console.log('Employee API Error:', error.message);
      setError('Unable to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees when screen opens
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Open delete confirmation popup
  const handleDeleteEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowConfirmModal(true);
  };

  // Confirm and delete employee
  const confirmDeleteEmployee = async () => {
    if (!selectedEmployee || deleting) {
      return;
    }

    try {
      setDeleting(true);

      await API.delete(
        `/api/employees/${selectedEmployee.id}`
      );

      // Remove deleted employee from the current list
      setEmployees((currentEmployees) =>
        currentEmployees.filter(
          (employee) => employee.id !== selectedEmployee.id
        )
      );

      setShowConfirmModal(false);

      setResultTitle('Deleted Successfully!');
      setResultMessage('Employee deleted successfully.');
      setDeleteSuccess(true);
      setShowResultModal(true);

    } catch (error) {
      console.log('Delete Employee Error:', error);

      setShowConfirmModal(false);

      setResultTitle('Delete Failed');
      setResultMessage(
        error.response?.data?.error ||
        'Unable to delete employee. Please try again.'
      );

      setDeleteSuccess(false);
      setShowResultModal(true);

    } finally {
      setDeleting(false);
    }
  };

  // Close result popup
  const closeResultModal = () => {
    setShowResultModal(false);
    setSelectedEmployee(null);
  };

  // Search and filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === 'All' ||
      employee.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Display employee card
  const renderEmployee = ({ item }) => (
    <View style={styles.employeeCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.employeeName}>
          {item.name}
        </Text>

        <Text
          style={[
            styles.status,
            item.status === 'Active'
              ? styles.activeStatus
              : styles.inactiveStatus,
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={styles.email}>
        {item.email}
      </Text>

      <Text style={styles.details}>
        Department: {item.department}
      </Text>

      <Text style={styles.details}>
        Designation: {item.designation}
      </Text>

      <Text style={styles.salary}>
        Salary: ₹{Number(item.salary).toLocaleString('en-IN')}
      </Text>

      {/* Edit Button */}
      <Pressable
        style={styles.editButton}
        onPress={() => router.push(`/employees/${item.id}`)}
      >
        <Text style={styles.editButtonText}>
          Edit Employee
        </Text>
      </Pressable>

      {/* Delete Button */}
      <Pressable
        style={styles.deleteButton}
        onPress={() => handleDeleteEmployee(item)}
      >
        <Text style={styles.deleteButtonText}>
          Delete Employee
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Employees</Text>

      <Text style={styles.subtitle}>
        Manage your employees
      </Text>

      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search employee..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Status filters */}
      <View style={styles.filterContainer}>
        {['All', 'Active', 'Inactive'].map((status) => (
          <Pressable
            key={status}
            style={[
              styles.filterButton,
              selectedStatus === status && styles.selectedFilter,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                selectedStatus === status && styles.selectedFilterText,
              ]}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Loading indicator */}
      {loading && (
        <ActivityIndicator size="large" color="#2563EB" />
      )}

      {/* Error message and retry */}
      {!loading && error !== '' && (
        <View>
          <Text style={styles.emptyText}>{error}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={fetchEmployees}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      )}

      {/* Employee list */}
      {!loading && error === '' && (
        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployee}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No employees found.
            </Text>
          }
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (!deleting) {
            setShowConfirmModal(false);
            setSelectedEmployee(null);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.warningIcon}>!</Text>

            <Text style={styles.modalTitle}>
              Delete Employee?
            </Text>

            <Text style={styles.modalMessage}>
              Are you sure you want to delete{' '}
              {selectedEmployee?.name}?
              {'\n'}This action cannot be undone.
            </Text>

            <View style={styles.modalButtonContainer}>

              {/* Cancel */}
              <Pressable
                style={styles.cancelButton}
                disabled={deleting}
                onPress={() => {
                  setShowConfirmModal(false);
                  setSelectedEmployee(null);
                }}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </Pressable>

              {/* Confirm Delete */}
              <Pressable
                style={[
                  styles.confirmDeleteButton,
                  deleting && styles.disabledButton,
                ]}
                disabled={deleting}
                onPress={confirmDeleteEmployee}
              >
                <Text style={styles.confirmDeleteText}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Text>
              </Pressable>

            </View>
          </View>
        </View>
      </Modal>

      {/* DELETE RESULT MODAL */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeResultModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text
              style={[
                styles.resultIcon,
                deleteSuccess
                  ? styles.successIcon
                  : styles.failureIcon,
              ]}
            >
              {deleteSuccess ? '✓' : '✕'}
            </Text>

            <Text style={styles.modalTitle}>
              {resultTitle}
            </Text>

            <Text style={styles.modalMessage}>
              {resultMessage}
            </Text>

            <Pressable
              style={styles.modalButton}
              onPress={closeResultModal}
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
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
    marginBottom: 18,
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 13,
    fontSize: 14,
    marginBottom: 14,
  },

  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },

  filterButton: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },

  selectedFilter: {
    backgroundColor: '#2563EB',
  },

  filterText: {
    color: '#475569',
    fontWeight: '600',
  },

  selectedFilterText: {
    color: '#FFFFFF',
  },

  employeeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flexShrink: 1,
    marginRight: 8,
  },

  status: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },

  activeStatus: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
  },

  inactiveStatus: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },

  email: {
    color: '#64748B',
    marginTop: 8,
    marginBottom: 10,
  },

  details: {
    color: '#334155',
    marginBottom: 7,
    fontSize: 14,
  },

  salary: {
    color: '#2563EB',
    fontWeight: 'bold',
    marginTop: 5,
  },

  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 30,
  },

  retryButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 12,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  editButton: {
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },

  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  deleteButton: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  deleteButtonText: {
    color: '#DC2626',
    fontWeight: 'bold',
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
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 350,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },

  warningIcon: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#D97706',
    borderWidth: 3,
    borderColor: '#D97706',
    width: 55,
    height: 55,
    borderRadius: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
    textAlign: 'center',
  },

  modalMessage: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 23,
  },

  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 24,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 14,
  },

  confirmDeleteButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  confirmDeleteText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  disabledButton: {
    opacity: 0.6,
  },

  successIcon: {
    color: '#16A34A',
  },

  failureIcon: {
    color: '#DC2626',
  },

  resultIcon: {
    fontSize: 42,
    fontWeight: 'bold',
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
