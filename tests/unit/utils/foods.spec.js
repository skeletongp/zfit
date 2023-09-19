import { useFoods, useNewFood } from "../../../src/utils/foods";
import supabase from "../../../src/utils/supabase";
import validate from "../validate";
describe("useNewFood_function", async () => {
  const newFood = {};
  var foodId = null;
  beforeEach(async () => {
    await supabase.auth.signOut();
    newFood.name = "Arroz blanco";
    newFood.group = "Cereales";
    newFood.Proteínas = 26.4;
    newFood.Calorías = 160;
  });
  //Tests that food instance is initialized
  it("test_food_has_all_properties", () => {
    const { food, nutrients } = useNewFood();
    const props = ["name", "group"];
    nutrients.map((nut)=>props.push(nut.name))
    props.forEach((prop) => {
      expect(food.hasOwnProperty(prop)).toEqual(true);
    });
  });


  //Tests that units instance has properties
  it("test_groups_has_properties", () => {
    const { groups } = useNewFood();
    const count = groups.length;
    expect(count).toBeGreaterThan(4);
  });

  //Tests that rules instance is initialized
  it("test_rules_has_all_properties", () => {
    const { rules, food } = useNewFood();
   expect(Object.keys(food)).toEqual(Object.keys(rules))
  });

  //Tests that rules validates name, group, proteins, calories
  it("test_rules_validation", async () => {
    const { food, rules } = useNewFood();
    food.name = "";
    food.group = "";
    food.Proteínas = null;
    const errors = await validate(food, rules);
    expect(errors.name).toBeTruthy();
    expect(errors.group).toBeTruthy();
    expect(errors['Proteínas']).toBeTruthy();
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
    food.id = 1;
    food.Calorías = 165;
    food.name="Edited Food";
    const res = await updateFood(food);
    expect(res.Calorías).toEqual(165);
  }); 

  //Tests that admin can delete food
  it("Must delete food", async () => {
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
    const isEmpty = Object.keys(food).every((key) => !food[key] );
    resetFood();
    expect(isEmpty).toEqual(true);
  });
});


describe("useFoods_function", async () => {
  var auth;
  beforeAll(async () => {
     auth = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
  });

  //Test that user could login withit
  it('should be logged user', async()=>{
    expect(auth.data.session).toBeTruthy();
  })

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
    params.search = "Cereales";
    await onSearch();
    expect(foods.value.length).toBeGreaterThan(0);
  });

  //Tests that can filter group
  it('test_on_filter_group', async()=>{
    const {  foods, onFilterGroup } = useFoods();
    await onFilterGroup('Cereales');
    const filtered=foods.value.filter((food)=>food.group=='Cereales')
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
    expect(foods.value.length).toBeGreaterThan(0);
    await onOrderBy("name");
    expect(foods.value.length).toBeGreaterThan(0);
  });

  //Tests that is paginating data
  it("test_pagination", async () => {
    const { foods, getFoods } = useFoods();
    await getFoods();
    expect(foods.value.length).toBeLessThan(11);
  });
  //Tests that is limiting data
  it("test_limit", async () => {
    const { params, foods, getFoods } = useFoods(false);
    params.limit = 50;
    await getFoods();
    expect(foods.value.length).toBeLessThan(params.limit+1);
  });

  //Tests that retrieve data without paginate nor limit
  it("test_no_paginate_nor_limit", async () => {
    const { params, foods, getFoods } = useFoods(false);
    params.limit = null;
    const instance = await getFoods();
    expect(foods.value.length).toBeGreaterThan(0);
  });
});

