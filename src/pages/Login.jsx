import Button from "../components/Button";
import Card from "../components/Card";
import { Dumbbell } from "lucide-react";
import supabase from "../../utils/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [session, setSession] = useState(null);
  const [loading, setloading] = useState(false);

  const handlesubmmit = async () => {
    try {
      setloading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      console.log("Signedin Successfully.");
    } catch (e) {
      console.log("Error Signin in", console.log(e.message));
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    if (session?.user?.id) {
      navigate("/workout");
    }
    return () => subscription.unsubscribe();
  }, [session, navigate]);

  const googleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="max-w-md  bg-gray-800 w-full p-6 sm:p-8  !dark:bg-gray-900 text-gray-900 dark:text-white border border-white/10 ">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome to FitRX
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            AI-Powered Adaptive Fitness
          </p>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 caret-indigo-600 dark:caret-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 caret-indigo-600 dark:caret-indigo-400 focus:ring-2 disabled:caret-indigo-800 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
            />
          </div>
        </div>
        <Button
          onClick={handlesubmmit}
          size="lg"
          className="w-full mb-4 text-base"
          disabled={loading}
        >
          {loading ? "Loading" : "Sign In"}
        </Button>

        <div className="flex  my-4">
          <button
            onClick={googleSignIn}
            className="grow px-4 py-3 border flex justify-center gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
          >
            <img
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
            />
            <span>Login with Google</span>
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </Card>
    </div>
  );
};

export default LoginScreen;
