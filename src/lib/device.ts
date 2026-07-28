const DEVICE_ID_KEY = 'professor_device_id';
const DEVICE_NAME_KEY = 'professor_display_name';

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, id);
    const name = generateProfessorName();
    localStorage.setItem(DEVICE_NAME_KEY, name);
  }
  return id;
}

export function getProfessorName(): string {
  return localStorage.getItem(DEVICE_NAME_KEY) || 'Professor';
}

function generateDeviceId(): string {
  return crypto.randomUUID();
}

function generateProfessorName(): string {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const number = Math.floor(Math.random() * 10) + 1;
  return `Prof ${letter}${number}`;
}
