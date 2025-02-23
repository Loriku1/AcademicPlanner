import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Icon, CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState({ id: null, title: '', course: '', dueDate: new Date(), description: '', completed: false });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const savedAssignments = await AsyncStorage.getItem('@assignments');
      if (savedAssignments) {
        const assignmentsData = JSON.parse(savedAssignments);
        const updatedAssignments = assignmentsData.map(a => ({
          ...a,
          dueDate: new Date(a.dueDate),
        }));
        setAssignments(updatedAssignments);
      }
    } catch (e) {
      console.error('Failed to load assignments', e);
    }
  };

  const saveAssignments = async (assignmentsToSave) => {
    try {
      await AsyncStorage.setItem('@assignments', JSON.stringify(assignmentsToSave));
    } catch (e) {
      console.error('Failed to save assignments', e);
    }
  };

  const handleAddAssignment = () => {
    setCurrentAssignment({ id: null, title: '', course: '', dueDate: new Date(), description: '', completed: false });
    setModalVisible(true);
  };

  const handleSaveAssignment = () => {
    if (!currentAssignment.title.trim()) return;
    const updatedAssignments = currentAssignment.id
      ? assignments.map(a => (a.id === currentAssignment.id ? currentAssignment : a))
      : [...assignments, { ...currentAssignment, id: Date.now().toString(), dueDate: currentAssignment.dueDate.toISOString() }];
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);
    setModalVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setCurrentAssignment({ ...currentAssignment, dueDate: new Date(selectedDate) });
    }
  };

  const toggleCompletion = (assignmentId) => {
    const updatedAssignments = assignments.map(a => (a.id === assignmentId ? { ...a, completed: !a.completed } : a));
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);
  };

  const handleDeleteAssignment = (assignmentId) => {
    const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);
  };

  const handleEditAssignment = (assignment) => {
    setCurrentAssignment({ ...assignment, dueDate: new Date(assignment.dueDate) });
    setModalVisible(true);
  };

  return (
<LinearGradient colors={['#00B4DB', '#0083B0', '#005F73']} style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.innerContainer}>
          <FlatList
            data={assignments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.assignmentItem, item.completed && styles.completedItem]}>
                <CheckBox checked={item.completed} onPress={() => toggleCompletion(item.id)} containerStyle={styles.checkbox} />
                <View style={styles.assignmentInfo}>
                  <Text style={styles.assignmentTitle}>{item.title}</Text>
                  <Text style={styles.courseName}>{item.course}</Text>
                  <Text style={styles.dueDate}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
                  {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => handleDeleteAssignment(item.id)} style={styles.deleteButton}>
                    <Icon name="delete" size={24} color="red" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEditAssignment(item)} style={styles.editButton}>
                    <Icon name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={styles.flatListContent}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddAssignment}>
            <Icon name="add" size={30} color="white" />
          </TouchableOpacity>

          <Modal visible={modalVisible} animationType="slide" transparent>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{currentAssignment.id ? 'Edit Assignment' : 'Add Assignment'}</Text>
                  <TextInput style={styles.input} placeholder="Assignment Title" value={currentAssignment.title} onChangeText={(text) => setCurrentAssignment({ ...currentAssignment, title: text })} />
                  <TextInput style={styles.input} placeholder="Course Name" value={currentAssignment.course} onChangeText={(text) => setCurrentAssignment({ ...currentAssignment, course: text })} />
                  <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text>Due Date: {currentAssignment.dueDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {showDatePicker && <DateTimePicker value={currentAssignment.dueDate} mode="date" display="default" onChange={handleDateChange} />}
                  <TextInput style={[styles.input, { height: 80 }]} placeholder="Description" multiline value={currentAssignment.description} onChangeText={(text) => setCurrentAssignment({ ...currentAssignment, description: text })} />
                  <View style={styles.modalButtons}>
                    <Button title="Cancel" onPress={() => setModalVisible(false)} color="#999" />
                    <Button title="Save" onPress={handleSaveAssignment} color="#2196F3" />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  innerContainer: { flex: 1 },
  flatListContent: { paddingBottom: 80 }, // Shtojmë padding në fund për të lënë vend për butonin "Add"
  assignmentItem: { flexDirection: 'row', alignItems: 'center', padding: 15, marginVertical: 5, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  completedItem: { backgroundColor: '#d3ffd3', opacity: 0.7 },
  checkbox: { padding: 0, margin: 0, backgroundColor: 'transparent', borderWidth: 0 },
  assignmentInfo: { flex: 1 },
  assignmentTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  courseName: { color: '#666', marginVertical: 3 },
  dueDate: { fontSize: 14, color: '#888' },
  description: { fontSize: 14, color: '#555' },
  addButton: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#2196F3', borderRadius: 50, width: 60, height: 60, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  deleteButton: { marginLeft: 10, padding: 8 },
  editButton: { marginLeft: 10, padding: 8 },
  actionButtons: { flexDirection: 'row', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { height: 40, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }
});

export default Assignments;