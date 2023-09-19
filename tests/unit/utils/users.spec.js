import { useUsers, useNewUser, useEditUser } from "../../../src/utils/users";
import supabase from "../../../src/utils/supabase";

describe("useUsers_function", async () => {
  beforeEach(async () => {
    await supabase.auth.signOut();
  });

  //Tests that params and users is initialized
  it("test_params_and_users", async () => {
    const { params, users } = useUsers();
    expect(typeof params).toEqual("object");
    expect(users.value).toEqual([]);
  });

  //Tests that admin can retrieve users
  it("test_admin_can_get_users", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { params, users, getUsers } = useUsers();
    const instance = await getUsers();
    expect(users.value.length).toBeGreaterThan(3);
  });

  //Tests that admin can retrieve users with contacts
  it("test_admin_can_retrieve_users_w_contacts", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { params, users, getUsers } = useUsers();
    params.cols = "*, contacts(*)";
    await getUsers();
    expect(users.value.length).toBeGreaterThan(0);
  });

  //Tests that trainer can get users
  it("test_trainer_can_get_users", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_TRAINER_EMAIL,
      password: import.meta.env.VITE_TRAINER_PASSWORD,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { users, getUsers } = useUsers();
    await getUsers();
    const filtered = users.value.filter((usr) => {
      return usr.id == user.id || usr.trainer_id == user.id;
    });
    expect(users.value.length).toEqual(filtered.length);
  });

  //Tests that client can get just self
  it("test_client_can_get_just_self", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_CLIENT_EMAIL,
      password: import.meta.env.VITE_CLIENT_PASSWORD,
    });
    const { users, getUsers } = useUsers();
    await getUsers();
    expect(users.value.length).toEqual(1);
  });

  //Tests that user can get just self
  it("test_user_can_get_just_self", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_USER_EMAIL,
      password: import.meta.env.VITE_USER_PASSWORD,
    });
    const { users, getUsers } = useUsers();
    await getUsers();
    expect(users.value.length).toEqual(1);
  });

  //Tests that client can get weight
  it("Client should get weight", async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_CLIENT_EMAIL,
      password: import.meta.env.VITE_CLIENT_PASSWORD,
    });
    const { getWeight } = useUsers();
    const weight = await getWeight(data.user.id);
    expect([200, 201]).toContain(weight);
    const noweight = await getWeight("none");
    expect([200, 201]).toContain(noweight);
  });

  //Tests that client can get measures
  it("Client should get measures", async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_CLIENT_EMAIL,
      password: import.meta.env.VITE_CLIENT_PASSWORD,
    });
    const { getMeasures } = useUsers();
    var measure = await getMeasures(data.user.id);
    measure = await getMeasures("none");
    expect(measure.length).toBe(0);
  });

  //Test that cant get IMC status
  it("Should get IMC status", () => {
    const { imcStatus } = useUsers();
    var status = imcStatus(18);
    expect(status).toBe("Bajo peso");
    status = imcStatus(18.5);
    expect(status).toBe("Normal");
    status = imcStatus(25);
    expect(status).toBe("Sobrepeso");
    status = imcStatus(30);
    expect(status).toBe("Obesidad");
  });

  //Tests that can find user by email
  it("test_can_find_user_by_email", async () => {
    await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { findUser } = useUsers();
    const { data } = await findUser(import.meta.env.VITE_USER_EMAIL, "email");
    expect(data.email).toBeDefined();
    expect(data.email).toEqual(import.meta.env.VITE_USER_EMAIL);
  });
});

describe("useUserEdit_function", async () => {
  const photo =
    "https://mikogujxrkylpxslwcva.supabase.co/storage/v1/object/public/zfit_storage/icon.png";
  beforeEach(async () => {
    await supabase.auth.signOut();
  });
  var userToEdit = null;
  //Test can load prevuser
  it("Should load prev user", async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const { user, loadUser } = useEditUser();
    const prevUser = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();
    await loadUser(prevUser.data);
    const isAssigned = Object.keys(user).every(
      (key) => user[key] === prevUser.data[key]
    );
    userToEdit = user;
    expect(isAssigned).toBe(true);
  });

  //Test that can update user
  it("Should update user", async () => {
    const { user, updateUser, updatePhoto } = useEditUser();
    Object.assign(user, userToEdit);
    const { data } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const now = new Date();
    user.address = now.toString();
    const res = await updateUser();
    await updatePhoto(null);
    expect(res.address).toBe(now.toString());
  });

  //Test that can update photo
  it("Should update photo confirmed", async () => {
    const { user, updatePhoto } = useEditUser();
    Object.assign(user, userToEdit);
    user.photo="test/file"
    const { data } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
    const res = await updatePhoto(photo, "confirm");
    expect(res.photo).toBe(photo);
  });

  //Test that can update photo
  it("Should update photo canceled", async () => {
    const { user, updatePhoto } = useEditUser();
    Object.assign(user, userToEdit);
    const { data } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });

    const res = await updatePhoto(photo, "cancel");
    expect(res.error).toBeNull();
  });

  //Test that can catch  photo error
  it("Should catch photo error and remove it", async () => {
    const { user, updatePhoto } = useEditUser();
    user.photo = 2;

    const res = await updatePhoto(photo, "confirm");
    expect(res.error).toBeNull();
  });

  //Test return null if photo is null
  it("Should return null when photo is null", async () => {
    const { user, updatePhoto } = useEditUser();

    const res = await updatePhoto(null, "cancel");
    expect(res).toBeNull();
  });
});
