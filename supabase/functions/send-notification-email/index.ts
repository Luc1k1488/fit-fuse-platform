
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  type: 'role_change' | 'user_blocked' | 'user_unblocked';
  userEmail: string;
  adminEmail?: string;
  details?: {
    oldRole?: string;
    newRole?: string;
    reason?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userEmail, adminEmail, details }: NotificationEmailRequest = await req.json();

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case 'role_change':
        subject = "Изменение роли в системе";
        htmlContent = `
          <h1>Ваша роль была изменена</h1>
          <p>Здравствуйте!</p>
          <p>Ваша роль в системе была изменена:</p>
          <ul>
            <li><strong>Предыдущая роль:</strong> ${details?.oldRole || 'Не задана'}</li>
            <li><strong>Новая роль:</strong> ${details?.newRole}</li>
          </ul>
          ${details?.reason ? `<p><strong>Причина:</strong> ${details.reason}</p>` : ''}
          <p>С уважением,<br>Команда поддержки</p>
        `;
        break;

      case 'user_blocked':
        subject = "Ваш аккаунт заблокирован";
        htmlContent = `
          <h1>Ваш аккаунт заблокирован</h1>
          <p>Здравствуйте!</p>
          <p>Ваш аккаунт был заблокирован администратором системы.</p>
          ${details?.reason ? `<p><strong>Причина:</strong> ${details.reason}</p>` : ''}
          <p>Для получения дополнительной информации обратитесь в службу поддержки.</p>
          <p>С уважением,<br>Команда поддержки</p>
        `;
        break;

      case 'user_unblocked':
        subject = "Ваш аккаунт разблокирован";
        htmlContent = `
          <h1>Ваш аккаунт разблокирован</h1>
          <p>Здравствуйте!</p>
          <p>Ваш аккаунт был разблокирован. Теперь вы можете снова пользоваться системой.</p>
          <p>С уважением,<br>Команда поддержки</p>
        `;
        break;

      default:
        throw new Error("Неизвестный тип уведомления");
    }

    const emailResponse = await resend.emails.send({
      from: "Система управления <noreply@yourdomain.com>",
      to: [userEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email отправлен успешно:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Ошибка при отправке email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
