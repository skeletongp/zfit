import { useRoutines, useNewRoutine } from "../../../src/utils/routines";
import validate from "../validate";
import supabase from "../../../src/utils/supabase";
describe("useRoutines_function", () => {
  // Tests that params and routines are initialized correctly
  it("test_initialization", () => {
    const { params, routines } = useRoutines();
    expect(typeof params).toEqual("object");
    expect(routines.value).toEqual([]);
  });

  // Tests that admin can get routines
  it("Admin should get all routines", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { routines, getRoutines } = useRoutines();
    const instance = await getRoutines();
    expect(routines.value.length).toBeGreaterThan(0);
  });

  // Tests that trainer can get routines
  it("Trainer could read proper or public routines", async () => {
    const {
      data: { user },
    } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_TRAINER_EMAIL,
      password: import.meta.env.VITE_TRAINER_PASSWORD,
    });
    const { routines, getRoutines } = useRoutines();
    await getRoutines();
    const isValid = routines.value.every(
      (routine) => routine.status == "Public" || routine.user_id == user.id
    );
    expect(isValid).toBe(true);
  });

  // Tests that client can get routines
  it("Client could read suscribed or public routines", async () => {
    const {
      data: { user },
    } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_CLIENT_EMAIL,
      password: import.meta.env.VITE_CLIENT_PASSWORD,
    });
    const loggedUser = await supabase
      .from("users")
      .select()
      .eq("id", user.id)
      .maybeSingle();
    const { routines, getRoutines } = useRoutines();
    await getRoutines();
    const isValid = routines.value.every(
      (routine) =>
        routine.status == "Public" ||
        routine.trainer_id == loggedUser.data.trainer_id
    );
    expect(isValid).toBe(true);
  });

  // Tests that user can get routines
  it("User could read or public routines", async () => {
    const {
      data: { user },
    } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_CLIENT_EMAIL,
      password: import.meta.env.VITE_CLIENT_PASSWORD,
    });
    const { routines, getRoutines } = useRoutines();
    await getRoutines();
    const isValid = routines.value.every(
      (routine) => routine.status == "Public"
    );
    expect(isValid).toBe(true);
  });
  // Tests that onSearch function clears routines array and calls getRoutines function
  it("test_on_search", async () => {
    await supabase.auth.signInWithPassword({
        email: import.meta.env.VITE_ADMIN_EMAIL,
        password: import.meta.env.VITE_ADMIN_PASSWORD,
      });
    const { routines, params, onSearch } = useRoutines();
    params.search = "Cardio";
   await onSearch();
    expect(routines.value.length).toBeGreaterThan(0);
  });
});

describe("useNewRoutine_function", () => {
  // Tests that routine and rules are initialized
  it("test_initialization", () => {
    const { routine, rules } = useNewRoutine();
    expect(typeof routine).toEqual("object");
    expect(typeof rules).toEqual("object");
  });

  //Tests that saveRoutine save item in data base and restart routine
  it("test_saving_routine", async () => {
    const { routine, saveRoutine } = useNewRoutine();
    const res = await saveRoutine(routine);
    console.log(res);
    const isEmpty = Object.keys(routine).every((key) => routine[key] == null);
    expect(res).toEqual(false);
    expect(isEmpty).toEqual(true);
  });

  //Test that resetRoutine works properly
  it("test_reset_routine", () => {
    const { routine, resetRoutine } = useNewRoutine();
    const isEmpty = Object.keys(routine).every((key) => routine[key] == null);
    resetRoutine();
    expect(isEmpty).toEqual(true);
  });

  //Tests that rules validates name, description and image
  it("test_rules", async () => {
    const { routine, rules } = useNewRoutine();
    routine.name = "";
    routine.description = "";
    routine.image = "";
    const errors = await validate(routine, rules);
    expect(errors.name).toBeTruthy();
    expect(errors.description).toBeTruthy();
    expect(errors.image).toBeTruthy();
  });

  //Tests that rules validates name and description min
  it("test_min", async () => {
    const { routine, rules } = useNewRoutine();
    routine.name = "Pepe";
    routine.description = "Test short";
    const errors = await validate(routine, rules);
    expect(errors.name).toBeTruthy();
    expect(errors.description).toBeTruthy();
  });

  //Tests that rules validates image type url
  it("test_image_url", async () => {
    const { routine, rules } = useNewRoutine();
    routine.image = "testcontent";
    const errors = await validate(routine, rules);
    expect(errors.image).toBeTruthy();
  });

  //Tests that rules validation pass
  it("test_validation_pass", async () => {
    const { routine, rules } = useNewRoutine();
    routine.name = "Name of the object";
    routine.description = "Short description just for testing purposes";
    routine.image = "https://vitest.dev/logo-shadow.svg";
    const result = await validate(routine, rules);
    expect(result).toEqual(true);
  });
});
