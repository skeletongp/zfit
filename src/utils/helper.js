import { alertController } from "@ionic/vue";

const presentConfirm = async (
  header,
  subheader = "",
  message = "",
  buttons = ["Ok"],
) => {
  const alert = await alertController.create({
    header: header,
    subHeader: subheader,
    message: message,
    buttons: buttons,
  });

  await alert.present();
};

export { presentConfirm };
