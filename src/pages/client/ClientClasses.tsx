import { useState, useEffect } from "react";
import { Calendar, Clock, Users, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ClassWithGym } from "@/types";
import { toast } from "sonner";
import { ClassBookingDialog } from "@/components/booking/ClassBookingDialog";

const ClientClasses = () => {
  const [classes, setClasses] = useState<ClassWithGym[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassWithGym | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const categories = [
    { id: "all", name: "Все занятия" },
    { id: "Фитнес", name: "Фитнес" },
    { id: "Йога", name: "Йога" },
    { id: "Кроссфит", name: "Кроссфит" },
    { id: "Бокс", name: "Бокс" },
    { id: "Велнес", name: "Велнес" },
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          gym:gym_id (*)
        `)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching classes:', error);
        toast.error('Ошибка загрузки занятий');
        return;
      }

      // Приводим к правильному типу
      const typedClasses: ClassWithGym[] = (data || []).map(classItem => ({
        ...classItem,
        gym: {
          ...classItem.gym,
          description: classItem.gym?.description || null,
          phone: classItem.gym?.phone || null,
        }
      }));

      setClasses(typedClasses);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.gym?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || classItem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookClass = (classItem: ClassWithGym) => {
    setSelectedClass(classItem);
    setBookingDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
          <h1 className="text-2xl font-bold text-white">Занятия</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-2">Занятия</h1>
        <p className="text-slate-300">Найдите и забронируйте тренировки</p>
      </div>

      <div className="px-4 space-y-6 py-6">
        {/* Search and Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Поиск занятий, инструкторов, залов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Найдено {filteredClasses.length} занятий
          </h2>

          {filteredClasses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">Занятия не найдены</p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}>
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClasses.map((classItem, index) => (
                <div
                  key={classItem.id}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {classItem.title}
                      </h3>
                      {classItem.description && (
                        <p className="text-slate-300 mb-2">{classItem.description}</p>
                      )}
                    </div>
                    {classItem.category && (
                      <span className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {classItem.category}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    {classItem.start_time && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(classItem.start_time).toLocaleDateString()} в{" "}
                          {new Date(classItem.start_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}

                    {classItem.instructor && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className="h-4 w-4" />
                        <span>{classItem.instructor}</span>
                      </div>
                    )}

                    {classItem.gym && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="h-4 w-4" />
                        <span>{classItem.gym.name}</span>
                      </div>
                    )}

                    {classItem.capacity && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className="h-4 w-4" />
                        <span>
                          {classItem.booked_count || 0}/{classItem.capacity} мест
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-slate-400 text-sm">
                      {classItem.gym?.location && (
                        <span>{classItem.gym.location}</span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleBookClass(classItem)}
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={classItem.booked_count >= (classItem.capacity || 0)}
                    >
                      {classItem.booked_count >= (classItem.capacity || 0) ? "Мест нет" : "Записаться"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedClass && (
        <ClassBookingDialog
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          classItem={selectedClass}
        />
      )}
    </div>
  );
};

export default ClientClasses;
