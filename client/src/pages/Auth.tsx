import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-marketplace.jpg";
import kalastraLogo from '../assets/Kalastra.jpg';
import GaneshaHandloom from "@/assets/Shri-Ganesha-Handloom.mp4";

import { login, register } from "@/api/auth";
import { setAccessToken } from "@/api/interceptor";
import { useAuth } from "@/contexts/AuthContext";

type LoginForm = {
  email: string;
  password: string;
};

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
};


export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginForm, setLoginForm] = useState<LoginForm>({
  email: "",
  password: ""
  });

  const [signupForm, setSignupForm] = useState<SignupForm>({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: ""
  });

  const handleLogin = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!loginForm.email || !loginForm.password) {
          toast({
            title: "Missing fields",
            description: "Email and password required",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      const res = await login({
        email: loginForm.email.toLowerCase().trim(),
        password: loginForm.password
      });
 
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    toast({
      title: "Login successful",
      description: `Welcome back, ${res.data.user.name}`
    });
    navigate("/");
    } catch (error: unknown) {
        toast({
          title: "Login failed",
          description: "Invalid credentials",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        name: `${signupForm.firstName} ${signupForm.lastName || ""}`.trim(),
        email: signupForm.email.toLowerCase().trim(),
        password: signupForm.password
      });

      setAccessToken(res.data.accessToken);
      setUser(res.data.user);

      toast({
        title: "Account created",
        description: "Welcome to CraftMarket"
      });

      navigate("/");
    } catch {
      toast({
        title: "Signup failed",
        description: "Try again with different email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

   return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-10"
      >
        <source src={GaneshaHandloom} type="video/mp4" />
        {/* Fallback image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      </video>
      <div className="absolute inset-0 bg-gradient-overlay" />
      <div className="relative w-full max-w-md z-10">

        {/* HEADER */}
        <div className="mb-4 flex items-center gap-4">
          <div className="w-40 h-20 rounded-lg overflow-hidden">
            <img
              src={kalastraLogo}
              alt="Kalastra Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div dir="ltr" className="border-s-4 border-white ps-3">
            <h1 className="text-3xl font-bold text-white">Kalastra</h1>
            <p className="text-white/80">Join the artisan community</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome</CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login">

              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* LOGIN  */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">

                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginForm.email}
                    required
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                  />

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginForm.password}
                      required
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>

                  <Button disabled={isLoading} className="w-full">
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* SIGNUP */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">

                  <Input
                    placeholder="First Name"
                    value={signupForm.firstName}
                    required
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, firstName: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Last Name"
                    value={signupForm.lastName}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, lastName: e.target.value })
                    }
                  />

                  <Input
                    type="email"
                    placeholder="Email"
                    required
                    value={signupForm.email}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, email: e.target.value })
                    }
                  />

                  <Input
                    type="password"
                    placeholder="Password"
                    required
                    value={signupForm.password}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, password: e.target.value })
                    }
                  />

                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={signupForm.confirmPassword}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        confirmPassword: e.target.value
                      })
                    }
                  />

                  <Button disabled={isLoading} className="w-full">
                    {isLoading ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* GOOGLE */}
            <Separator className="my-4" />

            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full"
            >
              Continue with Google
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}