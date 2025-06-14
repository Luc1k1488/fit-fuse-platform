
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateSupportChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  onChatCreated: (chatId: string) => void;
}

export const CreateSupportChatDialog: React.FC<CreateSupportChatDialogProps> = ({
  open,
  onOpenChange,
  currentUserId,
  onChatCreated
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Заполните все поля');
      return;
    }

    setCreating(true);
    try {
      // Создаем чат
      const { data: chatData, error: chatError } = await supabase
        .from('support_chats')
        .insert({
          user_id: currentUserId,
          subject: subject.trim(),
          priority,
          status: 'open'
        })
        .select()
        .single();

      if (chatError) throw chatError;

      // Создаем первое сообщение
      const { error: messageError } = await supabase
        .from('support_messages')
        .insert({
          chat_id: chatData.id,
          sender_id: currentUserId,
          message: message.trim(),
          is_from_support: false
        });

      if (messageError) throw messageError;

      toast.success('Обращение создано успешно');
      onChatCreated(chatData.id);
      onOpenChange(false);
      
      // Сбрасываем форму
      setSubject("");
      setMessage("");
      setPriority("medium");
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Ошибка создания обращения');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать обращение в поддержку</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Тема обращения</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Кратко опишите вашу проблему"
              required
            />
          </div>

          <div>
            <Label htmlFor="priority">Приоритет</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите приоритет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Низкий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
                <SelectItem value="urgent">Срочный</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Подробное описание</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Опишите вашу проблему подробно..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={creating}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Создание...' : 'Создать обращение'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
