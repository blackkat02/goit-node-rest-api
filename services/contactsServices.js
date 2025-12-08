import Contact from "../db/models/Contacts.js";

export async function listContacts(owner) {
  const contacts = await Contact.findAll({ where: { owner } });
  return contacts;
}

export async function getContactById(contactId, owner) {
  return await Contact.findOne({
    where: {
      id: contactId,
      owner,
    },
  });
}

export async function removeContact(contactId, owner) {
  const contact = await getContactById(contactId, owner);
  if (!contact) return null;

  await contact.destroy();
  return contact;
}

export async function addContact(payload) {
  const newContact = await Contact.create(payload);
  return newContact;
}

export async function updateContactById(contactId, owner, data) {
  const contact = await getContactById(contactId, owner);
  if (!contact) return null;

  return await contact.update(data);
}

export async function updateContactFavorite(contactId, owner, payload) {
  const contact = await Contact.findByPk(contactId, owner);
  if (!contact) return null;

  await contact.update(payload);
  return contact;
}
