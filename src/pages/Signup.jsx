import Button from "../components/Button";
import Card from "../components/Card";
import { Dumbbell, Mail, RefreshCw, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";

const SignupScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [stage, setStage] = useState("form");
  const [inputCode, setInputCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const OTP_LENGTH = 6;

  useEffect(() => {
    let t;
    if (resendTimer > 0) {
      t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSignup = async () => {
    setError("");
    if (!email || !password || !confirmPassword || !name) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await supabase.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: true },
      });
      setStage("otp");
      setOtpError("");
      setAttempts(0);
      setInputCode("");
      setResendTimer(60);
    } catch (error) {
      console.log("Something Went wrong" + error.message);
      setOtpError("Failed to Send OTP...");
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setOtpError("");
    if (inputCode.length < OTP_LENGTH) {
      setOtpError("Please enter the full 6-digit code.");
      return;
    }
    try {
      setLoading(true);
      const { data } =await supabase.auth.verifyOtp({
        email: email,
        token: inputCode,
        type: "email",
      });

      let userinfo = await supabase.auth.updateUser({
        password: password,
        data: { name: name },
      });
      userinfo=userinfo.data;
      console.log(userinfo)
      if (data.session) navigate("/onboarding");
    } catch (e) {
      console.log("Error:" + e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    try {
      await supabase.auth.resend({
        type: "signup",
        email: email,
      });
    } catch (e) {
      setOtpError("Failed to resend OTP.");
      console.log("Error:" + console.log(e.message));
    }
  };

  if (stage === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="max-w-md bg-gray-800 w-full p-6 sm:p-8 !dark:bg-gray-900 text-gray-900 dark:text-white border border-white/10 ">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Create your FitRX account
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Start your fitness journey today!
            </p>
          </div>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 caret-indigo-600 dark:caret-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 caret-indigo-600 dark:caret-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 caret-indigo-600 dark:caret-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              />
            </div>
          </div>
          {error && (
            <div className="mb-4 text-sm text-red-500 text-center font-medium">
              {error}
            </div>
          )}
          <Button
            onClick={handleSignup}
            size="lg"
            className="w-full mb-4 text-base"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </Card>
      </div>
    );
  }

  // OTP stage UI
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="max-w-md w-full p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
            <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-200" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Verify your account
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              A 6-digit code was sent to{" "}
              <span className="font-medium">{email}</span>.
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Enter the code below to confirm your email and finish setting up your
          account.
        </p>

        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400">
            Enter code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={OTP_LENGTH}
            value={inputCode}
            onChange={(e) =>
              setInputCode(
                e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH)
              )
            }
            className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg tracking-widest text-center caret-indigo-600 focus:outline-none"
            placeholder="••••••"
            aria-label="OTP code"
          />
        </div>

        {otpError && <p className="text-sm text-red-500 mb-3">{otpError}</p>}

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setStage("form");
              setInputCode("");
            }}
          >
            {/* change email */}
            <X className="w-4 h-4 mr-2" /> Change Email
          </Button>
        </div>

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <RefreshCw className="w-4 h-4 text-gray-500" />
            {resendTimer > 0 ? (
              <span>
                Resend code in{" "}
                <span className="font-medium">{resendTimer}s</span>
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-indigo-600 dark:text-indigo-300 font-medium"
              >
                Resend code
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Demo: the OTP is logged to console for testing. Attempts:{" "}
            <span className="font-medium">{attempts}</span>
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Didn't sign up?{" "}
            <button
              className="text-indigo-600"
              onClick={() => {
                setStage("form");
              }}
            >
              Go back to sign up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignupScreen;
