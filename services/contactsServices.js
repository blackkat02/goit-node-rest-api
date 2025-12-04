import Contact from "../db/models/Contacts.js";

export async function listContacts() {
  const contacts = await Contact.findAll();
  return contacts;
}

export async function getContactById(contactId) {
  const contact = await Contact.findByPk(contactId);
  return contact;
}

export async function removeContact(contactId) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;

  await contact.destroy();
  return contact;
}

export const addContact = async (payload) => {
  const newContact = await Contact.create(payload);
  return newContact;
};

export const updateContactById = async (contactId, payload) => {
  const contact = await Contact.findByPk(contactId);

  if (!contact) return null;

  return await contact.update(payload);
};

export async function updateContactFavorite(id, payload) {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;

  await contact.update(payload);
  return contact;
}
