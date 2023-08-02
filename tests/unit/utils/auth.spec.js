import { useLogin, useAuth, useSignup } from "../../../src/utils/auth";
import supabase from "../../../src/utils/supabase";

describe("authFunction", () => {
  //Tests that rules has items
  it("test_rules_initialized", () => {
    const { rules } = useSignup();
    expect(rules.length).toBeGreaterThan(0);
  });

  //Tests that user is initialized and had fields
  it("test_user_initialized", () => {
    const { user } = useSignup();
    const fields = ["name", "password", "email", "password_confirmation"];
    fields.forEach((field) => {
      expect(user.hasOwnProperty(field)).toBe(true);
    });
  });

  //Tests that can signup
  it("test_handle_signup", async () => {
    const { user, handleSignup } = useSignup();
    user.name = "Ismael Contreras";
    user.email = import.meta.env.VITE_TEST_EMAIL;
    user.password = import.meta.env.VITE_TEST_PASSWORD;
    user.password_confirmation = import.meta.env.VITE_TEST_PASSWORD;
    const res = await handleSignup();
    expect([true, undefined]).toContain(res);
  });
});
