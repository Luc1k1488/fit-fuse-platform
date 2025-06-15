
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Check, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CreateTestUsers = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<string[]>([]);

  const testUsers = [
    {
      email: "admin@test.com",
      password: "admin123",
      name: "Администратор Тест",
      role: "admin"
    },
    {
      email: "partner@test.com",
      password: "partner123",
      name: "Партнер Тест",
      role: "partner"
    },
    {
      email: "support@test.com",
      password: "support123", 
      name: "Поддержка Тест",
      role: "support"
    },
    {
      email: "user@test.com",
      password: "user123",
      name: "Пользователь Тест",
      role: "user"
    }
  ];

  const updateExistingUserRole = async () => {
    setIsUpdating(true);
    try {
      console.log("Updating partner@test.com role to 'partner'");
      
      // Обновляем роль в таблице users
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'partner' })
        .eq('email', 'partner@test.com');

      if (updateError) {
        console.error("Error updating user role:", updateError);
        toast.error(`Ошибка обновления роли: ${updateError.message}`);
        return;
      }

      console.log("User role updated successfully");
      toast.success("Роль пользователя partner@test.com обновлена на 'partner'");
      
    } catch (error: any) {
      console.error("Error in updateExistingUserRole:", error);
      toast.error(`Ошибка: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const createTestUsers = async () => {
    setIsCreating(true);
    setCreatedUsers([]);
    
    try {
      console.log("Starting test user creation...");
      
      for (const user of testUsers) {
        try {
          console.log(`Creating user: ${user.email}`);
          
          // Создаем пользователя
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
              data: {
                name: user.name,
                role: user.role
              }
            }
          });

          if (signUpError) {
            console.error(`Error creating ${user.email}:`, signUpError);
            if (signUpError.message.includes("already registered")) {
              console.log(`User ${user.email} already exists, checking role...`);
              
              // Проверяем и обновляем роль существующего пользователя
              const { error: updateError } = await supabase
                .from('users')
                .update({ role: user.role })
                .eq('email', user.email);
                
              if (updateError) {
                console.error(`Error updating role for ${user.email}:`, updateError);
              } else {
                console.log(`Role updated for existing user: ${user.email}`);
                setCreatedUsers(prev => [...prev, `${user.email} (роль обновлена)`]);
              }
            }
            continue;
          }

          if (authData.user) {
            console.log(`User created: ${user.email}`);
            
            // Создаем запись в таблице users
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: authData.user.id,
                email: user.email,
                name: user.name,
                role: user.role
              });

            if (profileError) {
              console.error(`Error creating profile for ${user.email}:`, profileError);
            } else {
              console.log(`Profile created for: ${user.email}`);
              setCreatedUsers(prev => [...prev, user.email]);
            }
          }
          
        } catch (userError: any) {
          console.error(`Error with user ${user.email}:`, userError);
        }
      }
      
      toast.success("Тестовые пользователи созданы/обновлены");
      
    } catch (error: any) {
      console.error("Error creating test users:", error);
      toast.error(`Ошибка создания пользователей: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-2xl w-full">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
          </Link>
          <h1 className="text-2xl font-bold text-center">GoodFit</h1>
        </div>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <Users className="mr-2 h-6 w-6" />
              Создание тестовых пользователей
            </CardTitle>
            <CardDescription className="text-center">
              Создайте тестовых пользователей для проверки различных ролей
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Исправление роли партнера</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Если partner@test.com не может войти в партнерский дашборд, нажмите кнопку ниже
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={updateExistingUserRole}
              disabled={isUpdating}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              size="lg"
            >
              {isUpdating ? "Обновление..." : "Исправить роль partner@test.com"}
            </Button>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Тестовые пользователи:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {testUsers.map((user) => (
                  <div key={user.email} className="p-3 bg-gray-50 rounded-md">
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-gray-600">{user.email}</div>
                    <div className="text-xs text-gray-500">Роль: {user.role}</div>
                    <div className="text-xs text-gray-500">Пароль: {user.password}</div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={createTestUsers}
                disabled={isCreating}
                className="w-full"
                size="lg"
              >
                {isCreating ? "Создание пользователей..." : "Создать/Обновить всех пользователей"}
              </Button>

              {createdUsers.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center mb-2">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Созданы/обновлены:</span>
                  </div>
                  <ul className="text-sm text-green-700">
                    {createdUsers.map((email, index) => (
                      <li key={index}>{email}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTestUsers;
