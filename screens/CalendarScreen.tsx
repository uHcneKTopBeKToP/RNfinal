import React, { useEffect, useMemo, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getAllViolations } from '../services/db';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

type Violation = {
  id: number;
  description: string;
  category: string;
  photo_base64?: string | null;
  photo_url?: string | null;
  date_time: string;
};

type DayType = {
  day: number;
  month: number;
  year: number;
  timestamp: number;
  dateString: string;
};

export default function CalendarScreen() {
  const { t, i18n } = useTranslation();
  const { themeName } = useContext(ThemeContext);
  const isDark = themeName === 'dark';

  const [violations, setViolations] = useState<Violation[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const lang = i18n.language;
    type CalendarTranslation = {
      monthNames: string[];
      monthNamesShort: string[];
      dayNames: string[];
      dayNamesShort: string[];
      today: string;
    };
    const trans = i18n.options.resources?.[lang]?.translation as unknown as CalendarTranslation;
    if (trans) {
      LocaleConfig.locales[lang] = {
        monthNames: trans.monthNames,
        monthNamesShort: trans.monthNamesShort,
        dayNames: trans.dayNames,
        dayNamesShort: trans.dayNamesShort,
        today: trans.today,
      };
      LocaleConfig.defaultLocale = lang;
    }
  }, [i18n.language]);

  useFocusEffect(
    React.useCallback(() => {
      const loadViolations = async () => {
        setLoading(true);
        try {
          const all = await getAllViolations();
          setViolations(all || []);
        } catch (err) {
          console.error('Ошибка при загрузке нарушений:', err);
        } finally {
          setLoading(false);
        }
      };
      loadViolations();
    }, [])
  );

  useEffect(() => {
      const marks: Record<string, any> = {};
      violations.forEach((v) => {
      const date = v.date_time?.split('T')[0];
      if (!date) return;
      if (!marks[date]) {
      marks[date] = { marked: true, dots: [{ key: 'v', color: '#ff5252' }] };
    }

  });


    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: isDark ? '#1e90ff' : '#00adf5',
      };
    }

    setMarkedDates(marks);
  }, [violations, selectedDate, isDark]);

  const onDayPress = (day: DayType) => {
    setSelectedDate((prev) => (prev === day.dateString ? null : day.dateString));
  };

  const filteredViolations = useMemo(() => {
    if (!selectedDate) return [];
    return violations.filter((v) => v.date_time.startsWith(selectedDate));
  }, [violations, selectedDate]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} color={isDark ? '#1e90ff' : '#00adf5'} />
      ) : (
        <>
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType="multi-dot"
            firstDay={1}
            theme={{
              backgroundColor: isDark ? '#121212' : '#fff',
              calendarBackground: isDark ? '#121212' : '#fff',
              textSectionTitleColor: isDark ? '#b6c1cd' : '#000',
              selectedDayTextColor: '#fff',
              todayTextColor: isDark ? '#1e90ff' : '#00adf5',
              dayTextColor: isDark ? '#fff' : '#2d4150',
              monthTextColor: isDark ? '#fff' : '#000',
              arrowColor: isDark ? '#fff' : '#000',
            }}
          />

          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
            {selectedDate ? `${t('savedViolations')} ${selectedDate}` : t('selectDate')}
          </Text>

          <FlatList
            data={filteredViolations}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              selectedDate ? (
                <Text style={[styles.empty, { color: isDark ? '#ccc' : '#999' }]}>{t('noViolationsOnDate')}</Text>
              ) : (
                <Text style={[styles.hint, { color: isDark ? '#ccc' : '#666' }]}>{t('chooseDateHint')}</Text>
              )
            }
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.desc, { color: isDark ? '#fff' : '#000' }]}>{item.description}</Text>
                    <Text style={[styles.meta, { color: isDark ? '#aaa' : '#666' }]}>
                      {t('category')}: {item.category}
                    </Text>
                    <Text style={[styles.meta, { color: isDark ? '#aaa' : '#666' }]}>
                      {t('date')}: {item.date_time}
                    </Text>
                  </View>
                  {item.photo_url ? (
                    <Image source={{ uri: item.photo_url }} style={styles.thumb} />
                  ) : item.photo_base64 ? (
                    <Image source={{ uri: `data:image/jpeg;base64,${item.photo_base64}` }} style={styles.thumb} />
                  ) : null}
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontWeight: '600', fontSize: 16, margin: 12 },
  hint: { margin: 12 },
  empty: { margin: 12 },
  item: { borderBottomWidth: 1, borderColor: '#eee', padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  desc: { fontWeight: '500' },
  meta: { marginTop: 4, fontSize: 12 },
  thumb: { width: 64, height: 64, marginLeft: 12, borderRadius: 6 },
});
