import supabase, { userRole } from "../../../src/utils/supabase";
import { setActivePinia, createPinia } from "pinia";

describe("supabase_class", () => {
  setActivePinia(createPinia());
  //Tests thats supabase client is created
  it("supabase_is_created", () => {
    expect(supabase).toBeDefined();
  });

  //Tests that role is checked as true
  it("test_role_true", () => {
    const user = { role: "admin" };
    localStorage.setItem("zfitLoggedUser", JSON.stringify(user));
    const role = userRole(["admin"]);
    localStorage.removeItem('zfitLoggedUser')
    expect(role).toEqual(true);
  });
  
  //Tests that role is checked as false
  it("test_role_false", () => {
    const user = { role: "admin" };
    localStorage.setItem("zfitLoggedUser", JSON.stringify(user));
    const role = userRole(["user"]);
    localStorage.removeItem('zfitLoggedUser')
    expect(role).toEqual(false);
  });
});
