import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const CourseSchedule = () => {
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({ id: null, name: '', time: '', days: '', location: '' });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const savedCourses = await AsyncStorage.getItem('@courses');
      if (savedCourses) setCourses(JSON.parse(savedCourses));
    } catch (e) {
      console.error('Failed to load courses', e);
    }
  };

  const saveCourses = async (coursesToSave) => {
    try {
      await AsyncStorage.setItem('@courses', JSON.stringify(coursesToSave));
    } catch (e) {
      console.error('Failed to save courses', e);
    }
  };

  const handleAddCourse = () => {
    setCurrentCourse({ id: null, name: '', time: '', days: '', location: '' });
    setModalVisible(true);
  };

  const handleSaveCourse = () => {
    if (!currentCourse.name.trim()) return;
    const updatedCourses = currentCourse.id
      ? courses.map((course) => (course.id === currentCourse.id ? currentCourse : course))
      : [...courses, { ...currentCourse, id: Date.now().toString() }];

    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    setModalVisible(false);
  };

  const handleEditCourse = (course) => {
    setCurrentCourse(course);
    setModalVisible(true);
  };

  const handleDeleteCourse = (courseId) => {
    const updatedCourses = courses.filter((course) => course.id !== courseId);
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  return (
    <LinearGradient colors={['#00B4DB', '#0083B0', '#005F73']} style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.courseDetails}>{item.days} • {item.time}</Text>
              <Text style={styles.courseDetails}>{item.location}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => handleEditCourse(item)} style={styles.iconButton}>
                <Icon name="edit" type="material" color="white" size={20} />
              </Pressable>
              <Pressable onPress={() => handleDeleteCourse(item.id)} style={styles.iconButtonDelete}>
                <Icon name="delete" type="material" color="white" size={20} />
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable style={styles.addButton} onPress={handleAddCourse}>
        <Icon name="add" size={30} color="white" />
      </Pressable>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{currentCourse.id ? 'Edit Course' : 'Add Course'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Course Name"
                value={currentCourse.name}
                onChangeText={(text) => setCurrentCourse({ ...currentCourse, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Time (e.g., 9:00 AM - 10:30 AM)"
                value={currentCourse.time}
                onChangeText={(text) => setCurrentCourse({ ...currentCourse, time: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Days (e.g., Mon, Wed, Fri)"
                value={currentCourse.days}
                onChangeText={(text) => setCurrentCourse({ ...currentCourse, days: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={currentCourse.location}
                onChangeText={(text) => setCurrentCourse({ ...currentCourse, location: text })}
              />
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} color="#999" />
                <Button title="Save" onPress={handleSaveCourse} color="#2196F3" />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  courseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  courseInfo: { flex: 1 },
  courseName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  courseDetails: { fontSize: 14, color: '#555' },
  actions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  iconButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 5 },
  iconButtonDelete: { backgroundColor: '#F44336', padding: 8, borderRadius: 5 },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2196F3',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { height: 40, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 },
});

export default CourseSchedule;