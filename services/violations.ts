import api from './api';

export async function fetchViolations(token: string) {
  try {
    const res = await api.get('/api/violations', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.log('Ошибка загрузки с сервера:', err);
    throw err;
  }
}

export async function createViolation(token: string, violation: any) {
  try {
    const res = await api.post('/api/violations', violation, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.log('Ошибка создания нарушения на сервере:', err);
    throw err; 
  }
}
