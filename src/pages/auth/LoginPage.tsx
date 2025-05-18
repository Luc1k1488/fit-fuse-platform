
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
          </Link>
          <h1 className="text-2xl font-bold text-center">GoodFit</h1>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-center">Добро пожаловать!</CardTitle>
            <CardDescription className="text-center">Выберите способ входа</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="client">Клиент</TabsTrigger>
                <TabsTrigger value="admin">Администратор</TabsTrigger>
              </TabsList>
              
              <TabsContent value="client" className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-center text-gray-600">
                    Клиенты могут войти с помощью номера телефона
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate("/login/phone")}
                  >
                    Войти по номеру телефона
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">или</span>
                  </div>
                </div>
                
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/register")}
                  >
                    Создать новый аккаунт
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="admin">
                <div className="space-y-2">
                  <p className="text-sm text-center text-gray-600 mb-4">
                    Только для сотрудников, партнеров и администраторов
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate("/admin/login")}
                  >
                    Перейти к входу для администраторов
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
