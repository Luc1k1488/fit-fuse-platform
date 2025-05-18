
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PhoneLoginPage = () => {
  const [phone, set_phone] = useState("");
  const [verification_code, set_verification_code] = useState("");
  const [is_code_sent, set_is_code_sent] = useState(false);
  const [error, set_error] = useState("");
  const [is_loading, set_is_loading] = useState(false);
  const { login_with_phone } = useAuth();
  const navigate = useNavigate();

  const handle_send_code = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_error("");
    set_is_loading(true);

    try {
      // In a real app, this would send an OTP to the phone
      // For demo, we just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      set_is_code_sent(true);
    } catch (err) {
      set_error("Failed to send verification code. Please try again.");
    } finally {
      set_is_loading(false);
    }
  };

  const handle_verify_code = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_error("");
    set_is_loading(true);

    try {
      await login_with_phone(phone, verification_code);
      navigate("/app");
    } catch (err) {
      set_error("Invalid verification code. Please try again.");
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {is_code_sent ? "Enter Verification Code" : "Login with Phone"}
          </CardTitle>
          <CardDescription className="text-center">
            {is_code_sent
              ? "We've sent a verification code to your phone"
              : "Enter your phone number to sign in or create an account"}
          </CardDescription>
        </CardHeader>
        
        {!is_code_sent ? (
          <form onSubmit={handle_send_code}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => set_phone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={is_loading}
              >
                {is_loading ? "Sending code..." : "Send verification code"}
              </Button>
              <div className="text-center text-sm">
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Login with email instead
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handle_verify_code}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  value={verification_code}
                  onChange={(e) => set_verification_code(e.target.value)}
                  placeholder="Enter the 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={is_loading}
              >
                {is_loading ? "Verifying..." : "Verify and login"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => set_is_code_sent(false)}
                disabled={is_loading}
              >
                Back to phone input
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default PhoneLoginPage;
