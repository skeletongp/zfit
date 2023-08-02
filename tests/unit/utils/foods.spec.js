import { useFoods, useNewFood } from "../../../src/utils/foods";
import supabase from "../../../src/utils/supabase";
import validate from "../validate";

describe("useFoods_function", async () => {
  await supabase.auth.signInWithPassword({
    email: import.meta.env.VITE_TEST_EMAIL,
    password: import.meta.env.VITE_TEST_PASSWORD,
  });
  //Tests that params and foods is initialized
  it("test_params_and_foods", async () => {
    const { params, foods } = useFoods();
    expect(typeof params).toEqual("object");
    expect(foods.value).toEqual([]);
  });

  //Tests that it's getting foods
  it("test_get_foods", async () => {
    const { params, foods, getFoods } = useFoods();
    params.paginate = true;
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

  //Tests that is ordering data
  it("test_on_order_by", async () => {
    const { params, foods, onOrderBy } = useFoods();
    params.ascend = true;
    await onOrderBy("name");
    expect(foods.value[0].name[0]).toEqual("A");
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
    food.name = "Arroz blanco";
    food.group = "Cereales";
    food.proteins = 26.4;
    food.calories = 160;
    food.unit="100 g"
    const result = await validate(food, rules);
    expect(result).toEqual(true);
  });

  //Tests that saveFood save item in data base and restart food
  it("test_saving_food", async () => {
    const { food, saveFood } = useNewFood();
    food.name = "Arroz blanco";
    food.group = "Cereales";
    food.proteins = 26.4;
    food.calories = 160;
    const res = await saveFood(food);
    const isEmpty = Object.keys(food).every((key) => food[key] == null);
    expect(res).toEqual(false);
    expect(isEmpty).toEqual(false);
  });

  //Tests that saveFood save item in data base and restart food
  it("test_updating_food", async () => {
    const { food, updateFood } = useNewFood();
    food.name = "Arroz blanco";
    food.group = "Cereales";
    food.proteins = 26.4;
    food.calories = 160;
    food.id = 0;
    const res = await updateFood(food);
    expect(res).toEqual([]);
  });

  //Test that resetFood works properly
  it("test_reset_food", () => {
    const { food, resetFood } = useNewFood();
    const isEmpty = Object.keys(food).every((key) => food[key] == null);
    resetFood();
    expect(isEmpty).toEqual(true);
  });
});
