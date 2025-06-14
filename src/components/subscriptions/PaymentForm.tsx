
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface PaymentFormProps {
  planName: string;
  planPrice: number;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  planName,
  planPrice,
  onPaymentSuccess,
  onBack
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [holderName, setHolderName] = useState("");
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !holderName) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    setProcessing(true);
    
    try {
      // Имитация обработки платежа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // В реальном приложении здесь была бы интеграция с платежной системой
      toast.success('Платеж успешно обработан!');
      onPaymentSuccess();
    } catch (error) {
      toast.error('Ошибка обработки платежа');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Оплата подписки
            </CardTitle>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">{planName}</span>
              <span className="text-xl font-bold">{planPrice.toLocaleString()} ₽</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="holderName">Имя владельца карты</Label>
              <Input
                id="holderName"
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="IVAN PETROV"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Номер карты</Label>
              <Input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Срок действия</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  className="mt-1"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Lock className="h-4 w-4" />
              <span>Ваши данные защищены SSL-шифрованием</span>
            </div>

            <Button
              type="submit"
              disabled={processing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {processing ? 'Обработка...' : `Оплатить ${planPrice.toLocaleString()} ₽`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
