import Contact from "../db/models/Contacts.js";

// export async function updateContacts(contacts) {
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
// }

export async function listContacts() {
  const contacts = await Contact.findAll();
  return contacts;
}

// export const getAllMovies = (search = {})=> {
//     const {filter = {}} = search;
//     return Movie.find(filter);
// };

// const contacts = await Contact.findAll();
//   return contacts;

// export async function getContactById(Id) {
//   const contacts = await listContacts();
//   const contact = contacts.find((contact) => contact.id === Id);
//   return contact || null;
// }

// export async function removeContact(contactId) {
//   const contacts = await listContacts();
//   const index = contacts.findIndex((contact) => contact.id === contactId);

//   if (index === -1) {
//     return null;
//   }

//   const [result] = contacts.splice(index, 1);
//   await updateContacts(contacts);
//   return result;
// }

// export async function addContact({ name, email, phone }) {
//   const contacts = await listContacts();
//   const newContact = {
//     id: nanoid(),
//     name,
//     email,
//     phone,
//   };
//   contacts.push(newContact);
//   await updateContacts(contacts);
//   return newContact;
// }

// export const updateContactById = async (id, data) => {
//   const contacts = await listContacts();
//   const index = contacts.findIndex((contact) => contact.id === id);
//   if (index === -1) {
//     return null;
//   }

//   contacts[index] = { ...contacts[index], ...data };
//   await updateContacts(contacts);

//   return contacts[index];
// };
