const providers = [
  {
    label: "Email",
    value: "email",
    icon: "mailOpenOutline",
    url: "mailto:",
  },
  {
    label: "Facebook",
    value: "facebook",
    icon: "logoFacebook",
    url: "https://www.facebook.com/",
  },
  {
    label: "Instagram",
    value: "instagram",
    icon: "logoInstagram",
    url: "https://www.instagram.com/",
  },
  {
    label: "TikTok",
    value: "tiktok",
    icon: "logoTiktok",
    url: "https://www.tiktok.com/@",
  },
  {
    label: "Whatsapp",
    value: "whatsapp",
    icon: "logoWhatsapp",
    url: "https://wa.me/1",
  },
];

const email = (data) => {
  //validate email with regex
  const regex = /\S+@\S+\.\S+/;
  if (!regex.test(data)) {
    return false;
  }
  return true;
};
const facebook = (data) => {
  //validate facebook is username with regex
  const regex = /^[a-zA-Z0-9.]{5,}$/;
  if (!regex.test(data)) {
    return false;
  }
  return true;
};

const instagram = (data) => {
  //validate instagram is username with regex
  const regex = /^[a-zA-Z0-9._]{5,}$/;
  if (!regex.test(data)) {
    return false;
  }
  return true;
};

const tiktok = (data) => {
  //validate tiktok is username with regex
  const regex = /^[a-zA-Z0-9._]{5,}$/;
  if (!regex.test(data)) {
    return false;
  }
  return true;
};

const whatsapp = (data) => {
  //validate whatsapp is number with ten digits starting with 809, 829 or 849 with regex
  const regex = /^(809|829|840)\d{0,7}$/;
  if (!regex.test(data)) {
    return false;
  }
  return true;
};

const validate = (provider, data) => {
  switch (provider) {
    case "email":
      return email(data);
    case "facebook":
      return facebook(data);
    case "instagram":
      return instagram(data);
    case "tiktok":
      return tiktok(data);
    case "whatsapp":
      return whatsapp(data);
    default:
      return false;
  }
};

export { providers, validate };
