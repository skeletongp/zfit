import { useLogin, useAuth, useSignup } from "../../../src/utils/auth";
import supabase, { supabaseAdmin } from "../../../src/utils/supabase";
import validate from "../validate";

describe("signupFunction", () => {
  beforeEach(async () => {
    await supabase.auth.signOut();
  });

 

  it("Should list and delete all users", async () => {
    const {
      data: { users },
      error,
    } = await supabaseAdmin.auth.admin.listUsers();
    expect(error).toBeNull();
    users.forEach(async (user) => {
      const res = await supabaseAdmin.auth.admin.deleteUser(user.id);
      expect(res.error).toBeNull();
    });
  });

  //Tests that rules has same props as user
  it("rules_initialized", () => {
    const { rules, user } = useSignup();
    expect(Object.keys(rules)).toEqual(Object.keys(user));
  });

  //Tests that user is initialized and had fields
  it("test_user_initialized", () => {
    const { user } = useSignup();
    const fields = ["name", "password", "email", "password_confirmation"];
    fields.forEach((field) => {
      expect(user.hasOwnProperty(field)).toBe(true);
    });
  });

  it("test_validation_rules", async () => {
    const { user, rules } = useSignup();
    user.name = "";
    user.email = "pepe";
    user.password = "user1234";
    user.password_confirmation = "User1234";
    const res = await validate(user, rules);
    expect(res.name).toBeTruthy();
    expect(res.email).toBeTruthy();
    expect(res.password).toBeTruthy();
  });

  //Tests that validation pass properly
  it("test_validation_rules_pass", async () => {
    const { user, rules } = useSignup();
    user.name = "Ismael Contreras";
    user.email = "pepe@email.com";
    user.password = "User1234";
    user.password_confirmation = "User1234";
    const res = await validate(user, rules);
    expect(res).toBe(true);
  });

  //Tests that modal is opened
  it("test_modal_did_present", () => {
    const { isOpen, onModalDidPresent } = useSignup();
    onModalDidPresent();
    expect(isOpen.value).toBe(true);
  });

  //Tests that can signup admin
  it("test_signup_admin", async () => {
    const { user, handleSignup } = useSignup();
    user.name = "Ismael Contreras M.";
    user.email = import.meta.env.VITE_ADMIN_EMAIL;
    user.password = import.meta.env.VITE_ADMIN_PASSWORD;
    user.password_confirmation = import.meta.env.VITE_ADMIN_PASSWORD;
    user.role = "admin";
    const res = await handleSignup();
    expect([200, 422]).toContain(res.status);
  });
  //Tests that can signup trainer
  it("test_signup_trainer", async () => {
    const { user, handleSignup } = useSignup();
    user.name = "Ismael Trainer";
    user.email = import.meta.env.VITE_TRAINER_EMAIL;
    user.password = import.meta.env.VITE_TRAINER_PASSWORD;
    user.password_confirmation = import.meta.env.VITE_TRAINER_PASSWORD;
    user.role = "trainer";
    const res = await handleSignup();
    expect([200, 422]).toContain(res.status);
  });
  //Tests that can signup client
  it("test_signup_client", async () => {
    const { user, handleSignup } = useSignup();
    user.name = "Ismael Client";
    user.email = import.meta.env.VITE_CLIENT_EMAIL;
    user.password = import.meta.env.VITE_CLIENT_PASSWORD;
    user.password_confirmation = import.meta.env.VITE_CLIENT_PASSWORD;
    user.role = "client";
    const res = await handleSignup();
    expect([200, 422]).toContain(res.status);
  });
  //Tests that can signup user
  it("test_signup_user", async () => {
    const { user, handleSignup } = useSignup();
    user.name = "Ismael User";
    user.email = import.meta.env.VITE_USER_EMAIL;
    user.password = import.meta.env.VITE_USER_PASSWORD;
    user.password_confirmation = import.meta.env.VITE_USER_PASSWORD;
    const res = await handleSignup();
    expect([200, 422]).toContain(res.status);
  });

  //Tests that can signup invited
  it("Invite can signup", async () => {
    const { user, handleSignup } = useSignup();
    user.name = "Ismael Invited";
    user.email = "invited@zfit.com";
    user.password = import.meta.env.VITE_USER_PASSWORD;
    user.password_confirmation = import.meta.env.VITE_USER_PASSWORD;
    const res = await handleSignup();
    expect([200]).toContain(res.status);
  });

  //Tests that signup throw error
  it("Failts throw error", async () => {
    const { user, handleSignup } = useSignup();
    user.name = "Ismael Invited";
    const res = await handleSignup();
    expect(res.status).toBe(501);
  });
});

describe("loginFunction", () => {
  beforeEach(async () => {
    await supabase.auth.signOut();
  });
  //Tests that user is initialized
  it("test_user_initialized", () => {
    const { user } = useLogin();
    const fields = ["email", "password", "remember"];
    expect(Object.keys(user)).toEqual(fields);
  });

  //Tests that isOpen is false
  it("test_is_open_false", () => {
    const { isOpen } = useLogin();
    expect(isOpen.value).toBe(false);
  });

  //Tests that modal is opened
  it("test_modal_did_present", () => {
    const { isOpen, onModalDidPresent } = useLogin();
    onModalDidPresent();
    expect(isOpen.value).toBe(true);
  });

  //Tests that admin can login
  it("test_admin_login", async () => {
    const { user, handleLogin } = useLogin();
    user.email = import.meta.env.VITE_ADMIN_EMAIL;
    user.password = import.meta.env.VITE_ADMIN_PASSWORD;
    user.remember = true;
    const res = await handleLogin();
    expect(res).toEqual("Bienvenido");
  });

  //Tests that client can login
  it("test_client_login", async () => {
    const { user, handleLogin } = useLogin();
    user.email = import.meta.env.VITE_CLIENT_EMAIL;
    user.password = import.meta.env.VITE_CLIENT_PASSWORD;
    const res = await handleLogin();
    expect(res).toEqual("Bienvenido");
  });
  //Tests that trainer can login
  it("test_trainer_login", async () => {
    const { user, handleLogin } = useLogin();
    user.email = import.meta.env.VITE_TRAINER_EMAIL;
    user.password = import.meta.env.VITE_TRAINER_PASSWORD;
    const res = await handleLogin();
    expect(res).toEqual("Bienvenido");
  });

  //Tests that user can login
  it("test_user_login", async () => {
    const { user, handleLogin } = useLogin();
    user.email = import.meta.env.VITE_USER_EMAIL;
    user.password = import.meta.env.VITE_USER_PASSWORD;
    const res = await handleLogin();
    expect(res).toEqual("Bienvenido");
  });

  //Tests that visitor can't login
  it("test_visitor_cant_login", async () => {
    const { user, handleLogin } = useLogin();
    user.email = "test@email.com";
    user.password = import.meta.env.VITE_USER_PASSWORD;
    const res = await handleLogin();
    expect(res).not.toEqual("Bienvenido");
  });
});
