
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const CreateTestUsers = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const testUsers = [
    {
      email: "partner@test.com",
      password: "partner123",
      name: "Тестовый Партнер",
      role: "partner"
    },
    {
      email: "support@test.com",
      password: "support123",
      name: "Сотрудник Поддержки", 
      role: "support"
    }
  ];

  const createTestUsers = async () => {
    setIsCreating(true);
    
    try {
      for (const user of testUsers) {
        console.log(`Creating user: ${user.email}`);
        
        // Создаем пользователя через Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              name: user.name,
              role: user.role
            }
          }
        });

        if (authError) {
          console.error(`Error creating user ${user.email}:`, authError);
          continue;
        }

        if (authData.user) {
          // Обновляем роль в таблице users
          const { error: updateError } = await supabase
            .from('users')
            .upsert({
              id: authData.user.id,
              email: user.email,
              name: user.name,
              role: user.role
            });

          if (updateError) {
            console.error(`Error updating user role for ${user.email}:`, updateError);
          }

          // Создаем партнера, если это партнер
          if (user.role === 'partner') {
            const { error: partnerError } = await supabase
              .from('partners')
              .insert({
                user_id: authData.user.id,
                name: user.name,
                email: user.email,
                phone: '+7 (999) 123-45-67',
                company_name: 'ФитнесПартнер ООО',
                status: 'active'
              });

            if (partnerError) {
              console.error('Error creating partner:', partnerError);
            }
          }
        }

        // Небольшая задержка между созданием пользователей
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Создаем тестовые залы для партнера
      await createTestGyms();
      
      // Создаем тестовые тикеты
      await createTestTickets();

      toast({
        title: "Успех",
        description: "Тестовые пользователи созданы успешно!",
      });

    } catch (error: any) {
      console.error('Error creating test users:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать тестовых пользователей",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const createTestGyms = async () => {
    try {
      // Получаем ID партнера
      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('email', 'partner@test.com')
        .single();

      if (partner) {
        const gyms = [
          {
            name: 'FitLife Центр',
            description: 'Современный фитнес-центр с полным оборудованием',
            address: 'ул. Спортивная, 10',
            city: 'Москва',
            phone: '+7 (495) 123-45-67',
            partner_id: partner.id,
            rating: 4.5,
            review_count: 15
          },
          {
            name: 'PowerGym',
            description: 'Зал для силовых тренировок',
            address: 'пр. Силовой, 25',
            city: 'Москва',
            phone: '+7 (495) 987-65-43',
            partner_id: partner.id,
            rating: 4.2,
            review_count: 8
          }
        ];

        const { error } = await supabase
          .from('gyms')
          .insert(gyms);

        if (error) {
          console.error('Error creating test gyms:', error);
        }
      }
    } catch (error) {
      console.error('Error in createTestGyms:', error);
    }
  };

  const createTestTickets = async () => {
    try {
      // Получаем ID пользователей
      const { data: partnerUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'partner@test.com')
        .single();

      const { data: supportUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'support@test.com')
        .single();

      if (partnerUser && supportUser) {
        const tickets = [
          {
            user_id: partnerUser.id,
            subject: 'Проблема с оплатой',
            message: 'Не могу оплатить абонемент, карта не проходит',
            status: 'open',
            assigned_support_id: supportUser.id
          },
          {
            user_id: partnerUser.id,
            subject: 'Вопрос по занятиям',
            message: 'Как изменить расписание занятий?',
            status: 'in_progress',
            assigned_support_id: supportUser.id
          }
        ];

        const { error } = await supabase
          .from('support_tickets')
          .insert(tickets);

        if (error) {
          console.error('Error creating test tickets:', error);
        }
      }
    } catch (error) {
      console.error('Error in createTestTickets:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Создание тестовых пользователей</CardTitle>
          <CardDescription>
            Создайте тестовых пользователей для проверки функционала партнеров и поддержки
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Будут созданы следующие пользователи:</h3>
            
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Партнер</h4>
                <p className="text-sm text-gray-600">Email: partner@test.com</p>
                <p className="text-sm text-gray-600">Пароль: partner123</p>
                <p className="text-sm text-gray-600">Роль: partner</p>
                <p className="text-sm text-gray-600">Доступ: /partner/dashboard</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Поддержка</h4>
                <p className="text-sm text-gray-600">Email: support@test.com</p>
                <p className="text-sm text-gray-600">Пароль: support123</p>
                <p className="text-sm text-gray-600">Роль: support</p>
                <p className="text-sm text-gray-600">Доступ: /support/dashboard</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Дополнительно будет создано:</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Профиль партнера с компанией</li>
                <li>• 2 тестовых зала для партнера</li>
                <li>• 2 тестовых тикета поддержки</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={createTestUsers}
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Создание...
                </>
              ) : (
                'Создать тестовых пользователей'
              )}
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
            >
              Назад
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTestUsers;
