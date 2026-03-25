import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, LoginFormValues } from "../validation/auth.schema";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (values: LoginFormValues) => {
    await login(values.email, values.password);
    navigate("/");
  };

  return (
    <section className="page">
      <h2>Sign In</h2>
      <form className="form" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <label>
          Email
          <input type="email" {...register("email")} />
        </label>
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label>
          Password
          <input type="password" {...register("password")} />
        </label>
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </section>
  );
};
