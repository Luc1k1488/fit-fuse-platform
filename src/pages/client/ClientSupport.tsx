
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportChatList } from "@/components/support/SupportChatList";
import { SupportChat } from "@/components/support/SupportChat";
import { CreateSupportChatDialog } from "@/components/support/CreateSupportChatDialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ClientSupport = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      toast.error('Ошибка аутентификации');
    }
  };

  const handleChatCreated = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  if (!currentUserId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Необходимо войти в систему для доступа к поддержке</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Поддержка</h1>
        <p className="text-gray-600">Получите помощь по любым вопросам</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список чатов */}
        <div className="lg:col-span-1">
          <SupportChatList
            currentUserId={currentUserId}
            onSelectChat={setSelectedChatId}
            onCreateChat={() => setShowCreateDialog(true)}
            selectedChatId={selectedChatId || undefined}
          />
        </div>

        {/* Активный чат или информация */}
        <div className="lg:col-span-2">
          {selectedChatId ? (
            <SupportChat
              chatId={selectedChatId}
              currentUserId={currentUserId}
              onClose={() => setSelectedChatId(null)}
            />
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Как мы можем помочь?
                  </CardTitle>
                  <CardDescription>
                    Выберите обращение из списка или создайте новое
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Создать новое обращение
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Альтернативные способы связи</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Email поддержка</p>
                      <p className="text-sm text-gray-600">support@fitapp.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Телефон поддержки</p>
                      <p className="text-sm text-gray-600">+7 (800) 123-45-67</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Часто задаваемые вопросы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h4 className="font-medium">Как отменить бронирование?</h4>
                    <p className="text-sm text-gray-600">
                      Перейдите в раздел "Мои бронирования" и нажмите "Отменить"
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h4 className="font-medium">Как продлить абонемент?</h4>
                    <p className="text-sm text-gray-600">
                      Откройте раздел "Подписка" и выберите "Продлить"
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h4 className="font-medium">Проблемы с оплатой</h4>
                    <p className="text-sm text-gray-600">
                      Проверьте настройки карты или обратитесь в поддержку
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <CreateSupportChatDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        currentUserId={currentUserId}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
};

export default ClientSupport;
