import { useRoutines, useNewRoutine } from "../../../src/utils/routines";
import validate from "../validate";
import supabase from "../../../src/utils/supabase";

describe("useNewRoutine_function", () => {
  const newRoutine = {};
  var routineId = null;
  beforeEach(async () => {
    await supabase.auth.signOut();
    newRoutine.name = "Test routine";
    newRoutine.description =
      "Long description for routine with details and intructions";
    newRoutine.image =
      "https://i0.wp.com/blog.smartfit.com.mx/wp-content/uploads/2019/10/SF_OCT19_BLOG_DIA_08.png?fit=1200%2C1000&ssl=1";
    newRoutine.duration = "10-20 Mins";
    newRoutine.goal = "The main goal for routine";
    newRoutine.range = "18-45 años";
    newRoutine.body = "50-120  Kgs.";
  });

  //Tests that food instance is initialized
  it("Routine should have all properties", () => {
    const { routine } = useNewRoutine();
    const props = Object.keys(newRoutine);
    props.forEach((prop) => {
      expect(routine.hasOwnProperty(prop)).toEqual(true);
    });
  });

  //Tests that rules instance is initialized
  it("Rules should have all properties", () => {
    const { rules, routine } = useNewRoutine();
    expect(Object.keys(routine)).toEqual(Object.keys(rules));
  });

  //Tests that rules validates name, group, proteins, calories
  it("Validation should fail here", async () => {
    const { routine, rules } = useNewRoutine();
    routine.name = "";
    routine.description = "";
    routine.goal = null;
    const errors = await validate(routine, rules);
    expect(errors.name).toBeTruthy();
    expect(errors.description).toBeTruthy();
    expect(errors.goal).toBeTruthy();
  });

  //Tests that rules validates name and group min
  it("Errors should have name and description for min validation", async () => {
    const { routine, rules } = useNewRoutine();
    routine.name = "Es";
    routine.description = "st";
    const errors = await validate(routine, rules);
    expect(errors.name).toBeTruthy();
    expect(errors.description).toBeTruthy();
  });

  //Tests that rules validates image type url
  it("Image should fail by format", async () => {
    const { routine, rules } = useNewRoutine();
    routine.image = "testcontent";
    const errors = await validate(routine, rules);
    expect(errors.image).toBeTruthy();
  });

  //Tests that rules validation pass
  it("Validation should pass", async () => {
    const { routine, rules } = useNewRoutine();
    Object.assign(routine, newRoutine);
    const result = await validate(routine, rules);
    expect(result).toEqual(true);
  });

  //Tests admin can save Routine
  it("Admin should save Routine", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { routine, saveRoutine } = useNewRoutine();
    Object.assign(routine, newRoutine);
    const res = await saveRoutine(routine);
    const isEmpty = Object.keys(routine).every((key) => routine[key] == null);
    routineId = res.id;
    expect(res.id).toBeTruthy();
    expect(isEmpty).toEqual(true);
  });

  //Tests trainer can save Routine
  it("Trainer should save Routine", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_TRAINER_EMAIL,
      password: import.meta.env.VITE_TRAINER_PASSWORD,
    });
    const { routine, saveRoutine } = useNewRoutine();
    Object.assign(routine, newRoutine);
    const res = await saveRoutine(routine);
    const isEmpty = Object.keys(routine).every((key) => routine[key] == null);
    routineId = res.id;
    expect(res.id).toBeTruthy();
    expect(isEmpty).toEqual(true);
  });

  //Tests client can´t save Routine
  it("Client shouldn´t save Routine", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_CLIENT_EMAIL,
      password: import.meta.env.VITE_CLIENT_PASSWORD,
    });
    const { routine, saveRoutine } = useNewRoutine();
    Object.assign(routine, newRoutine);
    const res = await saveRoutine(routine);
    expect(res.code).toBe("42501");
  });

  //Tests user can´t save Routine
  it("User shouldn´t save Routine", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_USER_EMAIL,
      password: import.meta.env.VITE_USER_PASSWORD,
    });
    const { routine, saveRoutine } = useNewRoutine();
    Object.assign(routine, newRoutine);
    const res = await saveRoutine(routine);
    expect(res.code).toBe("42501");
  });

  it("Admin should edit Routine", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { routine, updateRoutine } = useNewRoutine();
    Object.assign(routine, newRoutine);
    routine.id=1;
    routine.name=routine.name+" edited";
    const res = await updateRoutine(routine);
    expect(res.id).toBe(routine.id);
  });

  it("Test routines must be deleted", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { deleteRoutine } = useNewRoutine();
    const res = await deleteRoutine(newRoutine.name, "name");
    expect(res.status).toBe(204);
  });
  //Test that resetRoutine works properly
  it("Routine must be reset", () => {
    const { routine, resetRoutine } = useNewRoutine();
    const isEmpty = Object.keys(routine).every((key) => !routine[key]);
    resetRoutine();
    expect(isEmpty).toEqual(true);
  });
});

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
  it("Admin sould search routine", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { routines, params, onSearch } = useRoutines();
    params.search = "edited";
    await onSearch();
    expect(routines.value.length).toBeGreaterThan(0);
  });

  // Tests that findRoutine function works
  it("Admin should find routine", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { routine, findRoutine } = useRoutines();
    await findRoutine(1, "id");
    expect(routine.value.id).toBeDefined();
  });
});


