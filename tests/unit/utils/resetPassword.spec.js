import { useResetPassword } from "../../../src/utils/resetPassword";
import validate from "../validate";
import supabase from "../../../src/utils/supabase";

describe("resetPassword_function", () => {
  it("Rules must have keys from user", async () => {
    const { user, rules } = useResetPassword();
    const isValid = Object.keys(user).every((key) => rules[key] !== undefined);
    expect(isValid).toBe(true);
  });

  it("Validation must throw error for required", async () => {
    const { user, rules } = useResetPassword();
    user.password = null;
    user.password_confirmation = null;
    var res = await validate(user, rules);
    expect(res.password).toBeDefined();
    expect(res.password_confirmation).toBeDefined();
  });

  it("Validation must throw error by patterns", async () => {
    const { user, rules } = useResetPassword();
    user.password = "moso1234";
    user.password_confirmation = "Moso1234";
    const res = await validate(user, rules);
    expect(res.password).toContain("mayúsculas");
    expect(res.password_confirmation).toContain("coinciden");
  });

  it("Validation must pass", async () => {
    const { user, rules } = useResetPassword();
    user.password = import.meta.env.VITE_ADMIN_PASSWORD;
    user.password_confirmation = import.meta.env.VITE_ADMIN_PASSWORD;
    const res = await validate(user, rules);
    expect(res).toBe(true);
  });

  it("Must validate prev password", async () => {
    const { user, resetPassword } = useResetPassword();
    const { data } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    user.password = import.meta.env.VITE_ADMIN_PASSWORD;
    user.password_confirmation = import.meta.env.VITE_ADMIN_PASSWORD;
    const res = await resetPassword();
    expect(res).toBe(500);
  });

  it("Must catch error", async () => {
    const { user, resetPassword } = useResetPassword();
    const { data } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    user.password = "";
    const res = await resetPassword();
    expect(res).toBe(500);
  });

  it("Password must be changed", async () => {
    const { user, resetPassword } = useResetPassword();
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    user.password = "Moso12345";
    user.password_confirmation = "Moso12345";
    const res1 = await resetPassword();
    user.password = import.meta.env.VITE_ADMIN_PASSWORD;
    user.password_confirmation = import.meta.env.VITE_ADMIN_PASSWORD;
    const res2 = await resetPassword();
    expect(res1).toBe(200);
    expect(res2).toBe(200);
  });
});
