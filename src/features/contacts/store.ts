import create from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import { replacer, reviver } from "helper/json"
import { Contact } from "./types"

interface Actions {
  createContact: (a: Contact) => void
  deleteContact: (id: string) => void
  updateContact: (id: string, c: Contact) => void
}

interface ContactsState {
  byId: Map<string, Contact>
}

export const initialState = {
  byId: new Map(),
}

export const useContactsStore = create<ContactsState & Actions>(
  persist(
    set => ({
      ...initialState,
      createContact: (c: Contact) =>
        set(state => ({
          ...state,
          byId: new Map(state.byId).set(c.identity, c),
        })),
      updateContact: (id: string, c: Contact) =>
        set(state => ({
          ...state,
          byId: new Map(state.byId).set(id, c),
        })),
      deleteContact: (id: string) =>
        set(state => {
          const map = new Map(state.byId)
          map.delete(id)
          return {
            ...state,
            byId: map,
          }
        }),
    }),
    {
      name: "ALBERT.CONTACTS",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: state => JSON.stringify(state, replacer),
      deserialize: str => JSON.parse(str, reviver),
    },
  ),
)

export function useContactsList(searchName: string = "") {
  const contacts = useContactsStore(s => s.byId)

  const groups = Array.from(contacts).reduce((acc, [, contact]) => {
    const { name } = contact
    const letter = name[0]
    if (!acc[letter]) acc[letter] = [contact]
    else acc[letter].push(contact)
    return acc
  }, {} as { [k: string]: Contact[] })

  const groupsSorted = Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(group => {
      const [name, children] = group
      return {
        name,
        children: children
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(c =>
            c.name
              .toLocaleLowerCase()
              .startsWith(searchName.toLocaleLowerCase()),
          ),
      }
    })
    .filter(c => c.children.length > 0)

  const visibleContacts = groupsSorted.filter(c => c.children.length > 0)

  return { contacts: visibleContacts, total: contacts.size }
}
