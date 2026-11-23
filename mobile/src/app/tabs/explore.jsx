
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
  Alert,
} from 'react-native';

import API from '../../services/api';

export default function EmployeesScreen() {
  // Store employee records received from backend
  const [employees, setEmployees] = useState([]);

  // Store search text
  const [search, setSearch] = useState('');

  // Store selected status filter
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Track loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch employees when the screen opens
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

  // Run fetchEmployees when this screen first opens
  useEffect(() => {
    fetchEmployees();
  }, []);
   
// Delete employee function
const handleDeleteEmployee = async (id, employeeName) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${employeeName}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    await API.delete(`/api/employees/${id}`);

    window.alert('Employee deleted successfully!');

    fetchEmployees();
  } catch (error) {
    console.log('Delete Employee Error:', error);
    window.alert('Unable to delete employee.');
  }
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

  // Display one employee card
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
      <Pressable
  style={styles.editButton}
  onPress={() => router.push(`/employees/${item.id}`)}
>
  <Text style={styles.editButtonText}>
    Edit Employee
  </Text>
</Pressable>

<Pressable
  style={styles.deleteButton}
  onPress={() => handleDeleteEmployee(item.id, item.name)}
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

          <Pressable style={styles.retryButton} onPress={fetchEmployees}>
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
    </View>
  );
}

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

});
