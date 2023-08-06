import { useFoods, useNewFood } from "../../../src/utils/foods";
import supabase from "../../../src/utils/supabase";
import validate from "../validate";

describe("useFoods_function", async () => {
  beforeAll(async () => {
    const auth = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
  });

  //Tests that params and foods is initialized
  it("test_params_and_foods", async () => {
    const { params, foods } = useFoods();
    expect(typeof params).toEqual("object");
    expect(foods.value).toEqual([]);
  });

  //Tests that admin can get foods
  it("test_admin_gets_foods", async () => {
    const { foods, getFoods } = useFoods();
    await getFoods();
    expect(foods.value.length).toBeGreaterThan(0);
  });

  //Tests that search returns data
  it("test_on_search", async () => {
    const { params, foods, onSearch } = useFoods();
    params.paginate = true;
    params.search = "Carne";
    await onSearch();
    expect(foods.value.length).toBeGreaterThan(0);
  });

  //Tests that can filter group
  it('test_on_filter_group', async()=>{
    const {  foods, onFilterGroup } = useFoods();
    await onFilterGroup('Carnes');
    const filtered=foods.value.filter((food)=>food.group=='Carnes')
    expect(foods.value.length).toBeGreaterThan(0);
    expect(foods.value.length).toEqual(filtered.length);
    await onFilterGroup(null);
    expect(foods.value.length).toBeGreaterThan(0);

  })

  //Tests that is ordering data
  it("test_on_order_by", async () => {
    const { params, foods, onOrderBy } = useFoods();
    params.ascend = true;
    await onOrderBy("name");
    expect(foods.value[0].name[0]).toEqual("A");
    await onOrderBy("name");
    expect(foods.value[0].name[0]).toEqual("Z");
  });

  //Tests that is paginating data
  it("test_pagination", async () => {
    const { foods, getFoods } = useFoods();
    await getFoods();
    expect(foods.value.length).toEqual(10);
  });
  //Tests that is limiting data
  it("test_limit", async () => {
    const { params, foods, getFoods } = useFoods(false);
    params.limit = 50;
    await getFoods();
    expect(foods.value.length).toEqual(params.limit);
  });

  //Tests that retrieve data without paginate nor limit
  it("test_no_paginate_nor_limit", async () => {
    const { params, foods, getFoods } = useFoods(false);
    params.limit = null;
    const instance = await getFoods();
    expect(foods.value.length).toBeGreaterThan(0);
    expect(foods.value.length).toBeGreaterThan(params.perPage);
  });
});

describe("useNewFood_function", async () => {
  const newFood = {};
  var foodId = null;
  beforeEach(async () => {
    await supabase.auth.signOut();
    newFood.name = "Arroz blanco";
    newFood.group = "Cereales";
    newFood.proteins = 26.4;
    newFood.calories = 160;
    newFood.unit = "100 g";
  });
  //Tests that food instance is initialized
  it("test_food_has_all_properties", () => {
    const { food } = useNewFood();
    const props = ["name", "unit", "group", "proteins", "calories"];
    props.forEach((prop) => {
      expect(food.hasOwnProperty(prop)).toEqual(true);
    });
  });

  //Tests that units instance has properties
  it("test_units_has_properties", () => {
    const { units } = useNewFood();
    const count = units.length;
    expect(count).toEqual(2);
  });

  //Tests that units instance has properties
  it("test_groups_has_properties", () => {
    const { groups } = useNewFood();
    const count = groups.length;
    expect(count).toEqual(12);
  });

  //Tests that rules instance is initialized
  it("test_rules_has_all_properties", () => {
    const { rules } = useNewFood();
    const props = ["name", "group", "proteins", "calories"];
    props.forEach((prop) => {
      expect(rules.hasOwnProperty(prop)).toEqual(true);
    });
  });

  //Tests that rules validates name, group, proteins, calories
  it("test_rules_validation", async () => {
    const { food, rules } = useNewFood();
    food.name = "";
    food.group = "";
    food.proteins = "";
    food.calories = "";
    const errors = await validate(food, rules);
    expect(errors.name).toBeTruthy();
    expect(errors.group).toBeTruthy();
    expect(errors.proteins).toBeTruthy();
    expect(errors.calories).toBeTruthy();
  });

  //Tests that rules validates name and group min
  it("test_min_validation", async () => {
    const { food, rules } = useNewFood();
    food.name = "Es";
    food.group = "st";
    const errors = await validate(food, rules);
    expect(errors.name).toBeTruthy();
    expect(errors.group).toBeTruthy();
  });

  //Tests that rules validation pass
  it("test_validation_pass", async () => {
    const { food, rules } = useNewFood();
    Object.assign(food, newFood);
    const result = await validate(food, rules);
    expect(result).toEqual(true);
  });

  //Tests admin can save food
  it("test_admin_save_food", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { food, saveFood } = useNewFood();
    Object.assign(food, newFood);
    const res = await saveFood(food);
    foodId = res.id;
    expect(res.id).toBeTruthy();
  });

  //Tests trainer can save food
  it("test_trainer_save_food", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_TRAINER_EMAIL,
      password: import.meta.env.VITE_TRAINER_PASSWORD,
    });
    const { food, saveFood } = useNewFood();
    Object.assign(food, newFood);
    const res = await saveFood(food);
    expect(res.id).toBeTruthy();
  });

  //Tests client can't save food
  it("test_client_dont_save_food", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_CLIENT_EMAIL,
      password: import.meta.env.VITE_CLIENT_PASSWORD,
    });
    const { food, saveFood } = useNewFood();
    Object.assign(food, newFood);
    const res = await saveFood(food);
    expect(res.code).toEqual("42501");
  });

  //Tests user can't save food
  it("test_user_dont_save_food", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_USER_EMAIL,
      password: import.meta.env.VITE_USER_PASSWORD,
    });
    const { food, saveFood } = useNewFood();
    Object.assign(food, newFood);
    const res = await saveFood(food);
    expect(res.code).toEqual("42501");
  });

  //Tests that admin can update food
  it("test_admin_can_update_food", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { food, updateFood } = useNewFood();
    Object.assign(food, newFood);
    food.id = foodId;
    food.calories = 165;
    const res = await updateFood(food);
    expect(res.calories).toEqual(165);
  });

  //Tests that admin can delete food
  it("test_delete_food", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { deleteFood } = useNewFood();
    const res = await deleteFood(newFood.name, "name");
    expect(res.status).toBe(204);
  });

  //Test that resetFood works properly
  it("test_reset_food", () => {
    const { food, resetFood } = useNewFood();
    const isEmpty = Object.keys(food).every((key) => food[key] == null);
    resetFood();
    expect(isEmpty).toEqual(true);
  });
});
