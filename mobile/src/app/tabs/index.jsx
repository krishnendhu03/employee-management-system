
import { useState, useCallback } from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { useFocusEffect } from 'expo-router';

import API from '../../services/api';

export default function HomeScreen() {
  // Store employee records
  const [employees, setEmployees] = useState([]);

  // Track loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await API.get('/api/employees');

      setEmployees(response.data);
    } catch (error) {
      console.log('Dashboard API Error:', error.message);
      setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh dashboard whenever it becomes visible
  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, [])
  );

  // Calculate employee statistics
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === 'Active'
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === 'Inactive'
  ).length;

  const departments = [
    ...new Set(
      employees.map((employee) => employee.department)
    ),
  ];

  const departmentCount = departments.length;

  const totalSalary = employees.reduce(
    (total, employee) => total + Number(employee.salary || 0),
    0
  );

  const averageSalary =
    totalEmployees > 0
      ? totalSalary / totalEmployees
      : 0;

  const highestSalary =
    employees.length > 0
      ? Math.max(
          ...employees.map((employee) =>
            Number(employee.salary || 0)
          )
        )
      : 0;

  // Find latest employee using highest ID
  const latestEmployee =
    employees.length > 0
      ? [...employees].sort(
          (a, b) => Number(b.id) - Number(a.id)
        )[0]
      : null;

  // Format salary in Indian currency style
  const formatSalary = (amount) =>
    `₹${Number(amount).toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    })}`;

  // Dashboard statistics
  const statistics = [
    {
      label: 'Total Employees',
      value: totalEmployees,
    },
    {
      label: 'Active Employees',
      value: activeEmployees,
    },
    {
      label: 'Inactive Employees',
      value: inactiveEmployees,
    },
    {
      label: 'Departments',
      value: departmentCount,
    },
    {
      label: 'Average Salary',
      value: formatSalary(averageSalary),
    },
    {
      label: 'Highest Salary',
      value: formatSalary(highestSalary),
    },
  ];

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>
          Employee Manager
        </Text>

        <Text style={styles.welcome}>
          Welcome back!
        </Text>
      </View>

      {/* Dashboard Heading */}
      <View style={styles.heading}>
        <Text style={styles.title}>
          Dashboard
        </Text>

        <Text style={styles.subtitle}>
          Employee Management Overview
        </Text>
      </View>

      {/* Loading */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={styles.loader}
        />
      )}

      {/* Error */}
      {!loading && error !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={fetchEmployees}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      )}

      {/* Dashboard Content */}
      {!loading && error === '' && (
        <>
          {/* Statistics */}
          <View style={styles.statisticsContainer}>
            {statistics.map((item) => (
              <View
                style={styles.statCard}
                key={item.label}
              >
                <Text style={styles.statLabel}>
                  {item.label}
                </Text>

                <Text style={styles.statValue}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Latest Employee */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>
              Latest Employee
            </Text>

            {latestEmployee ? (
              <>
                <Text style={styles.infoText}>
                  Name: {latestEmployee.name}
                </Text>

                <Text style={styles.infoText}>
                  Department: {latestEmployee.department}
                </Text>

                <Text style={styles.infoText}>
                  Designation: {latestEmployee.designation}
                </Text>

                <Text style={styles.infoText}>
                  Status: {latestEmployee.status}
                </Text>
              </>
            ) : (
              <Text style={styles.infoText}>
                No employees available.
              </Text>
            )}
          </View>

          {/* Quick Summary */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>
              Quick Summary
            </Text>

            <Text style={styles.infoText}>
              Active: {activeEmployees}
            </Text>

            <Text style={styles.infoText}>
              Inactive: {inactiveEmployees}
            </Text>

            <Text style={styles.infoText}>
              Departments: {departmentCount}
            </Text>

            <Text style={styles.infoText}>
              Total Salary: {formatSalary(totalSalary)}
            </Text>
          </View>
        </>
      )}

    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
  },

  header: {
    backgroundColor: '#2563EB',
    padding: 20,
  },

  appName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  welcome: {
    color: '#DBEAFE',
    marginTop: 5,
    fontSize: 14,
  },

  heading: {
    padding: 20,
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
  },

  loader: {
    marginTop: 40,
  },

  statisticsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },

  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    margin: '1.5%',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    elevation: 3,
  },

  statLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },

  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    marginTop: 12,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    padding: 18,
    borderRadius: 10,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    color: '#334155',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },

  errorText: {
    color: '#DC2626',
    marginBottom: 12,
  },

  retryButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
