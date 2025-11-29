"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { axiosClientWithAuth } from "@/libs/axiosClient";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});
type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);

    try {
      const client = axiosClientWithAuth();
      const response = await client.post("auth/login", data);
      localStorage.setItem("adminId", response.data.admin.id);
      localStorage.setItem("token", response.data.token);
      router.push("/admin");
    } catch (err: any) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
        setIsError(false);
      }, 5000);
    }
  };

  return (
    <>
      {isClient && message && <Toast message={message} isError={isError} />}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Kepegawaian
          </a>

          <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>

              {/* Form */}
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    className="input w-full"
                    placeholder="Entry your email..."
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    className="input w-full"
                    placeholder="Entry your password..."
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-block"
                >
                  {loading ? "Loading..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Login;
