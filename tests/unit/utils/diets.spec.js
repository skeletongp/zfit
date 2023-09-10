import { useNewDiet } from "../../../src/utils/diets";
import supabase from "../../../src/utils/supabase";
import validate from "../validate";

describe("newDiet_function", () => {
  const newDiet = {};
  var dietId = null;
  beforeEach(async () => {
    await supabase.auth.signOut();
    newDiet.name = "Ensalada de Yogur con Frutas y Nueces";
    newDiet.type = "Desayuno";
    newDiet.goal =
      "Proporcionar un desayuno saludable y equilibrado que sea rico en proteínas y bajo en calorías";
    newDiet.proteins = 12;
    newDiet.calories = 225;
    newDiet.trainer_id = null;
    newDiet.user_id = null;
    newDiet.privacy = "public";
  });

  it("Rules must have some fields", async () => {
    const { diet, rules } = useNewDiet();
    const isValid = Object.keys(diet).every((key) => rules[key] !== undefined);
    expect(isValid).toBe(true);
  });
  it("Rule Foods must have some fields", async () => {
    const { dietFood, rulesFoods } = useNewDiet();
    const isValid = Object.keys(dietFood).every(
      (key) => rulesFoods[key] !== undefined
    );
    expect(isValid).toBe(true);
  });

  it("Rule Foods must fail", async () => {
    const { dietFood, rulesFoods } = useNewDiet();
    dietFood.cant = null;
    dietFood.food_id = null;
    const res = await validate(dietFood, rulesFoods);
    expect(res.cant).toBeDefined();
    expect(res.food_id).toBeDefined();
  });

  it("Rule Foods must pass validations", async () => {
    const { dietFood, rulesFoods } = useNewDiet();
    dietFood.cant = 2;
    dietFood.food_id = 5;
    const res = await validate(dietFood, rulesFoods);
    expect(res).toBe(true);
  });

  it("Rules must return errors", async () => {
    const { diet, rules } = useNewDiet();
    (newDiet.name = null), (newDiet.privacy = "wrong");
    newDiet.type = "wrong";
    newDiet.dietFoods = [];
    Object.assign(diet, newDiet);
    const res = await validate(diet, rules);
    expect(res.name).toBeDefined();
    expect(res.type).toBeDefined();
    expect(res.privacy).toBeDefined();
    expect(res.dietFoods).toBeDefined();
  });

  it("Rules must pass validations", async () => {
    const { diet, rules } = useNewDiet();
    newDiet.dietFoods = [
      {
        cant: 3,
        food_id: 1,
      },
    ];
    Object.assign(diet, newDiet);
    const res = await validate(diet, rules);
    expect(res).toBe(true);
  });

  it("Admin must save diet", async () => {
    const { diet, saveDiet } = useNewDiet();
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    newDiet.dietFoods = [
      {
        cant: 3,
        food_id: 14,
      },
    ];
    Object.assign(diet, newDiet);
    const res = await saveDiet();
    expect(res.id).toBeDefined();
    expect(res.trainer_id).not.toBeNull();
    expect(res.user_id).toBeNull();
  });

  it("Client must save diet", async () => {
    const { diet, saveDiet } = useNewDiet();
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_CLIENT_EMAIL,
      password: import.meta.env.VITE_CLIENT_PASSWORD,
    });
    newDiet.dietFoods = [
      {
        cant: 3,
        food_id: 14,
      },
    ];
    Object.assign(diet, newDiet);
    const res = await saveDiet();
    expect(res.id).toBeDefined();
    expect(res.user_id).not.toBeNull();
  });

  it("User must save diet as public", async () => {
    const { diet, saveDiet } = useNewDiet();
    newDiet.privacy = "secret";
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_USER_EMAIL,
      password: import.meta.env.VITE_USER_PASSWORD,
    });
    newDiet.dietFoods = [
      {
        cant: 3,
        food_id: 14,
      },
    ];
    Object.assign(diet, newDiet);
    const res = await saveDiet();
    expect(res.id).toBeDefined();
    expect(res.user_id).not.toBeNull();
    expect(res.privacy).toBe("public");
  });

  it("Admin must delete diets", async () => {
    const { deleteDiet } = useNewDiet();
    newDiet.privacy = "secret";
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_USER_EMAIL,
      password: import.meta.env.VITE_USER_PASSWORD,
    });
    const res=await deleteDiet("name", newDiet.name);
    expect(res.status).toBe(204)
  });
});
