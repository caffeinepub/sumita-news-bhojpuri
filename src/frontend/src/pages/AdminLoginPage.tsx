import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";
import { Loader2, LogIn } from "lucide-react";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  useEffect(() => {
    if (loginStatus === "success" && isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [loginStatus, isAdmin, navigate]);

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
            {checkingAdmin ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
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
                  केवल अधिकृत एडमिन ही लॉगिन कर सकते हैं
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
