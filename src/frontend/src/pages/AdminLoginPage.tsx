import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Loader2, LogIn } from "lucide-react";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, isLoggingIn } = useInternetIdentity();

  useEffect(() => {
    if (loginStatus === "success") {
      navigate({ to: "/admin" });
    }
  }, [loginStatus, navigate]);

  const handleLogin = async () => {
    await login();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display text-center">
              एडमिन लॉगिन
            </CardTitle>
            <CardDescription className="text-center">
              एडमिन पैनल में प्रवेश के लिए लॉगिन करें
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  लॉगिन हो रहा है...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  लॉगिन करें
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              पहले यूजर ऑटोमैटिक एडमिन बन जाएंगे
            </p>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
