
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, User } from "lucide-react";

const PartnerReviews = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Отзывы</h1>
        <p className="text-gray-400">Отзывы клиентов о ваших залах</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                  <CardTitle className="text-white text-lg">Анна Иванова</CardTitle>
                  <CardDescription className="text-gray-400">FitLife Центр</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Отличный зал! Современное оборудование, приятная атмосфера. 
              Инструкторы очень профессиональные. Рекомендую всем!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                  <CardTitle className="text-white text-lg">Петр Сидоров</CardTitle>
                  <CardDescription className="text-gray-400">PowerGym</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <Star className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Хороший зал, но иногда бывает многолюдно. В целом доволен качеством услуг.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerReviews;
