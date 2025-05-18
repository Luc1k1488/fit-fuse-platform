
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Fitness Platform</h1>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">Choose your login method</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="client">Client Login</TabsTrigger>
                <TabsTrigger value="admin">Admin Login</TabsTrigger>
              </TabsList>
              
              <TabsContent value="client" className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-center text-gray-600">
                    Clients can login with their phone number
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate("/login/phone")}
                  >
                    Login with Phone
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/register")}
                  >
                    Create a new account
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="admin">
                <div className="space-y-2">
                  <p className="text-sm text-center text-gray-600 mb-4">
                    For staff, partners, and administrators only
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate("/admin/login")}
                  >
                    Go to Admin Login
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
