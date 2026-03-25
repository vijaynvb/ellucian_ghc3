import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import loginIllustration from "../assets/login-illustration.png";
import { loginSchema, LoginFormValues } from "../validation/auth.schema";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);

    try {
      await login(values.email, values.password);
      const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";
      navigate(redirectTo);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in with the provided credentials.";
      setApiError(message);
    }
  };

  return (
    <section className={styles.shell}>
      <div className={styles.contentPanel}>
        <div className={styles.content}>
          <h1 className={styles.brand}>Company Name</h1>
          <p className={styles.intro}>Welcome back! Please login to your account.</p>

          <form className={styles.form} onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className={styles.input}
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>

            {apiError && <p className={styles.error}>{apiError}</p>}

            <div className={styles.optionsRow}>
              <label className={styles.checkboxLabel} htmlFor="remember-me">
                <input className={styles.checkbox} id="remember-me" type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <span className={styles.secondaryLink}>Use your assigned workspace credentials</span>
            </div>

            <div className={styles.actions}>
              <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
              <button className={styles.ghostButton} type="button" onClick={() => reset()} disabled={isSubmitting}>
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      <aside className={styles.visualPanel} aria-hidden="true">
        <nav className={styles.nav}>
          <span className={styles.navItemActive}>Home</span>
          <span className={styles.navItem}>About us</span>
          <span className={styles.navItem}>Blog</span>
          <span className={styles.navItem}>Pricing</span>
        </nav>
        <div className={styles.illustrationWrap}>
          <img className={styles.illustration} src={loginIllustration} alt="" />
        </div>
      </aside>
    </section>
  );
};
