import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  FlatList,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location"; 
import { initDB, addViolation, getAllViolations, ViolationInput } from "../services/db";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";

const NewViolationScreen = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [violations, setViolations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initDB();
        await loadViolations();
      } catch (err) {
        console.error("Ошибка инициализации базы:", err);
      }
    })();
  }, []);

  const loadViolations = async () => {
    try {
      const all = await getAllViolations();
      setViolations(all);
    } catch (err) {
      console.error("Ошибка при загрузке нарушений:", err);
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t("error"), t("cameraPermissionDenied"));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        base64: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setPhoto(asset.base64 || null);
      }
    } catch (err) {
      console.error("Ошибка при съёмке фото:", err);
    }
  };

  const getCoordinates = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("error"), t("locationPermissionDenied"));
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
    } catch (err) {
      console.error("Ошибка получения геолокации:", err);
    }
  };

  const saveViolation = async () => {
    if (!description || !category || !photo) {
      Alert.alert(t("error"), t("fillFieldsAndPhoto"));
      return;
    }

    setLoading(true);
    try {
      const payload: ViolationInput = {
        description,
        category,
        photo_base64: photo,
        latitude,
        longitude,
        date_time: new Date().toISOString(),
      };
      const id = await addViolation(payload);
      console.log("Нарушение сохранено:", { ...payload, id });

      await loadViolations();

      setDescription("");
      setCategory("");
      setPhoto(null);
      setLatitude(null);
      setLongitude(null);
    } catch (err) {
      console.error("Ошибка сохранения:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centerText}>{t("pleaseLoginToCreateViolation")}</Text>
      </View>
    );
  }

 return (
  <FlatList
    data={violations}
    keyExtractor={(item) => item.id.toString()}
    ListHeaderComponent={
      <View style={{ paddingBottom: 16 }}>
      
        <Text style={styles.label}>{t("description")}:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder={t("description")}
          placeholderTextColor="#1E90FF"
        />

        <Text style={styles.label}>{t("category")}:</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder={t("category")}
          placeholderTextColor="#1E90FF"
        />

        <View style={{ marginVertical: 8 }}>
          <Button title={t("takePhoto")} onPress={takePhoto} color="#1E90FF" />
        </View>

        {photo && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${photo}` }}
            style={styles.photo}
          />
        )}

        <View style={{ marginVertical: 8 }}>
          <Button title={t("getCoordinates")} onPress={getCoordinates} color="#1E90FF" />
        </View>

        {latitude && longitude && (
          <Text style={styles.textBlue}>
            {t("coordinates")}: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Text>
        )}

        <View style={{ marginVertical: 8 }}>
          <Button
            title={loading ? t("saving") : t("saveViolation")}
            onPress={saveViolation}
            color="#1E90FF"
          />
        </View>

        <Text style={styles.label}>{t("savedViolations")}:</Text>
      </View>
    }
    renderItem={({ item }) => (
      <View style={styles.violationItem}>
        <Text style={styles.textBlue}>ID: {item.id}</Text>
        <Text style={styles.textBlue}>
          {t("description")}: {item.description}
        </Text>
        <Text style={styles.textBlue}>
          {t("category")}: {item.category}
        </Text>
        {item.latitude != null && item.longitude != null && (
          <Text style={styles.textBlue}>
            {t("coordinates")}: {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
          </Text>
        )}
        {item.photo_base64 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.photo_base64}` }}
            style={styles.photoSmall}
          />
        )}
        <Text style={styles.textBlue}>
          {t("date")}: {item.date_time}
        </Text>
      </View>
    )}
    contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
  />
);

};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: "bold", marginTop: 16, color: "#1E90FF" },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
    borderColor: "#1E90FF",
    color: "#1E90FF",
  },
  photo: { width: "100%", height: 200, marginTop: 8 },
  photoSmall: { width: 100, height: 100, marginTop: 4 },
  violationItem: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    borderColor: "#1E90FF",
  },
  textBlue: { color: "#1E90FF" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  centerText: { fontSize: 16, textAlign: "center" },
});

export default NewViolationScreen;
