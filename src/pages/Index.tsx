
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Dumbbell, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  // Автоматически перенаправляем на логин если пользователь не авторизован
  useEffect(() => {
    // В реальном приложении здесь была бы проверка авторизации
    // Пока просто показываем страницу входа
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">GoodFit</CardTitle>
          <CardDescription>
            Добро пожаловать в приложение для управления фитнес-клубами
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => navigate("/login")} 
            className="w-full" 
            size="lg"
          >
            Войти в приложение
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            onClick={() => navigate("/register")} 
            variant="outline" 
            className="w-full" 
            size="lg"
          >
            Создать аккаунт
          </Button>
          <Button 
            onClick={() => navigate("/create-test-users")} 
            variant="secondary" 
            className="w-full" 
            size="sm"
          >
            <Users className="mr-2 h-4 w-4" />
            Создать тестовых пользователей
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <p>Нет аккаунта? Зарегистрируйтесь для доступа к приложению</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
