import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, "db", "contacts.json");

export async function updateContacts(contactId) {
  try{
    await fs.writeFile(contactsPath, JSON.stringify(contactId, null, 2))

  } catch (error) {
    console.error(`Помилка читання файлу контактів: ${error.message}`);
    return [];
  }
}

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    return contacts;
    
  } catch (error) {
    console.error(`Помилка читання файлу контактів: ${error.message}`);
    return [];
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(contact => contact.id === contactId);
    return contact || null;
    
  } catch (error) {
    console.error(`Контакт не знайдено: ${error.message}`);
    return null;
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId); 
    if(index === -1) {
      return null;
    }

    const [result] = await contacts.splice(index, 1);
    await updateContacts(contacts);
    return result;
    
  } catch (error) {
    console.error(`Контакт не знайдено: ${error.message}`);
    return null;
  }
}

export async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    
    const newContact = {
        id: nanoid(),
        name: name,
        email: email,
        phone: phone
    };
    contacts.push(newContact);
    await updateContacts(contacts);
    
    return newContact;
    
  } catch (error) {
    console.error(`Помилка читання файлу контактів: ${error.message}`);
    return null;
  }
}
