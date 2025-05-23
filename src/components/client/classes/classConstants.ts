
export const class_types = ["Все", "Силовые", "Йога", "HIIT", "Пилатес", "Кроссфит", "Кардио"];
export const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// Тестовые данные для занятий
export const mock_classes = [
  {
    id: "class-1",
    title: "Силовая тренировка",
    type: "Силовые",
    gymName: "Фитнес Элит",
    gymLocation: "Центр",
    instructor: "Алексей Иванов",
    date: "2023-06-15",
    time: "10:00 - 11:00",
    duration: "60 мин",
    spots: 5,
    totalSpots: 15,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3ltJTIwd29ya291dHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "class-2",
    title: "Йога для начинающих",
    type: "Йога",
    gymName: "Йога Студия Зен",
    gymLocation: "Запад",
    instructor: "Елена Смирнова",
    date: "2023-06-15",
    time: "12:00 - 13:00",
    duration: "60 мин",
    spots: 8,
    totalSpots: 20,
    image: "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYSUyMGNsYXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "class-3",
    title: "HIIT Интервальная",
    type: "HIIT",
    gymName: "Пауэр Хаус",
    gymLocation: "Садовое кольцо",
    instructor: "Дмитрий Кузнецов",
    date: "2023-06-15",
    time: "18:30 - 19:15",
    duration: "45 мин",
    spots: 3,
    totalSpots: 12,
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhpaXQlMjBmaXRuZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "class-4",
    title: "Пилатес",
    type: "Пилатес",
    gymName: "Фитнес Элит",
    gymLocation: "Центр",
    instructor: "Ольга Петрова",
    date: "2023-06-16",
    time: "11:00 - 12:00",
    duration: "60 мин",
    spots: 10,
    totalSpots: 15,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGlsYXRlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "class-5",
    title: "Кроссфит",
    type: "Кроссфит",
    gymName: "КроссФит Джанкшн",
    gymLocation: "Восток",
    instructor: "Максим Сидоров",
    date: "2023-06-16",
    time: "19:00 - 20:00",
    duration: "60 мин",
    spots: 2,
    totalSpots: 10,
    image: "https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3Jvc3NmaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  }
];

// Utility functions
export const getDateForDay = (dayIndex: number) => {
  const today = new Date();
  const diff = dayIndex - today.getDay();
  const date = new Date();
  date.setDate(today.getDate() + diff);
  return date.toISOString().split('T')[0];
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};
