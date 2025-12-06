import User from "./models/User.js";
import Contact from "./models/Contacts.js";

export const initAssociations = () => {
  User.hasMany(Contact, {
    foreignKey: "owner",
    as: "contacts",
  });

  Contact.belongsTo(User, {
    foreignKey: "owner",
    as: "user",
  });
};
