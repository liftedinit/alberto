import React from "react"
import create from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import { replacer, reviver } from "shared"
import { Contact } from "./types"
import { useAccountsStore } from "features/accounts"
import { AnonymousIdentity } from "@liftedinit/many-js"

interface Actions {
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
      name: "ALBERTO.CONTACTS",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: state => JSON.stringify(state, replacer),
      deserialize: str => JSON.parse(str, reviver),
    },
  ),
)

export function useContactsList(searchName: string = "") {
  const accounts = useAccountsStore(s => Array.from(s.byId)).reduce(
    (acc, [, account]) => {
      const { name, address } = account
      if (account?.identity instanceof AnonymousIdentity) return acc
      name && address && acc.push({ name, address })
      return acc
    },
    [] as { name: string; address: string }[],
  )
  const contacts = useContactsStore(s => Array.from(s.byId)).map(c => c[1])

  const { groups, count } = React.useMemo(() => {
    const count = new Map()
    return {
      groups: [...contacts, ...accounts].reduce((acc, item) => {
        const { name, address } = item
        if (address && !count.has(address)) {
          count.set(address, true)
          const letter = name.charAt(0).toLowerCase()
          if (!acc[letter]) acc[letter] = [item]
          else acc[letter].push(item)
        }
        return acc
      }, {} as { [k: string]: { name: string; address: string }[] }),
      count: count.size,
    }
  }, [accounts, contacts])

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

  return { contacts: groupsSorted, total: count }
}
